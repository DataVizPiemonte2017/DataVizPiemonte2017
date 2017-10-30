import json
import scrapy

start_urls = []
with open('W_Torino.json', 'r') as f:
	data = json.load(f)
	start_urls = data.values()

# ====== Scrape information from Wikipedia and Wikidata =====

#A. Define the data to be scraped
class StreetDedicationItem(scrapy.Item):
	wiki_url = scrapy.Field()
	name = scrapy.Field()
	wd_url = scrapy.Field()
	instance_type = scrapy.Field()
	gender = scrapy.Field()
	date_of_birth = scrapy.Field()
 	date_of_death = scrapy.Field()
	citizenship = scrapy.Field()
	img_url = scrapy.Field()
	mini_bio = scrapy.Field()

#B. Create a named spider
class SDedicationSpider(scrapy.Spider):
	""" This spider uses Wikipedia's pages to scrape Wikidata for basic biographical data """
	
	name = 'street_dedication'
	allowed_domains = ['it.wikipedia.org']
	start_urls = start_urls

	def parse(self, response):

		# Store page url 
		wiki_url = response.request.url

		# Extract page title as name
		name = response.xpath('//*[@id="firstHeading"]/text()').extract()

		# Extract Wikidata's url for the page
		wd_url = response.xpath('//li[@id="t-wikibase"]//a[1]//@href').extract()

		firstData = {'name' : name[0], 'wiki_url' : wiki_url, 'wd_url' : wd_url[0]}

		# Request additional data from Wikipedia's page
		request = scrapy.Request(
			wd_url[0],
			callback = self.parse_wikidata,
			dont_filter = True)
		request.meta['item'] = StreetDedicationItem(**firstData)
		yield request


	def parse_wikidata(self, response):

		item = response.meta['item']
		# Prepare xPaths for 'human'
		p_template = '//*[@id="{code}"]/div[2]/div/div/div[2]/div[1]/div/div[2]/div[2]{link_html}/text()'
		property_codes_human = [
			{'name':'gender', 'code':'P21', 'link':True},
			{'name':'citizenship', 'code':'P27', 'link':True},
			{'name':'date_of_birth', 'code':'P569'},
			{'name':'date_of_death', 'code':'P570'}
			]

		# Extract instance type
		p_instance = '//*[@id="P31"]/div[2]/div/div/div[2]/div[1]/div/div[2]/div[2]/a/text()'
		instance_types = response.xpath(p_instance).extract()
		# item['instance_type'] = instance_type

		for element in instance_types:
			if element == 'human':
				item['instance_type'] = element
				
				# If human, extract additional data	
				for prop in property_codes_human:

					link_html = ''
					if prop.get('link'):
						link_html = '/a'
					sel = response.xpath(p_template.format(code=prop['code'], link_html=link_html))
					if sel:
						item[prop['name']] = sel[0].extract()

				# Chain next request: go back to Wikipedia and extract picture and bio
				request = scrapy.Request(
					item['wiki_url'],
					callback=self.parse_human,
					dont_filter=True)
				request.meta['item'] = item
				yield request

			# If not human send data back to item
			else:
				item['instance_type'] = element
				yield item


	def parse_human(self, response):

		item = response.meta['item']

		# Extract image url
		img_src = response.xpath('//table[contains(@class,"sinottico")]//img/@src')
		if img_src:
			item['img_url'] = ['https:' + img_src.extract()[0]]

		# Extract mini_bio
		mini_bio = ''
		paras = response.xpath('//*[@id="mw-content-text"]/p[text() or normalize-space(.)=""]').extract()

		# Add paragraphs from paras until the first empy paragraph signals the end of the bio
		for p in paras:
			if p == '<p></p>':
				break
			mini_bio += p

		# Change links so that they can be reached from outside Wikipedia
		BASE_URL = 'https://it.wikipedia.org'
		mini_bio = mini_bio.replace('href="/wiki', 'href="' + BASE_URL + '/wiki')
		mini_bio = mini_bio.replace('href="#', item['wiki_url'] + '#')
		item['mini_bio'] = mini_bio

		# Send data back to item
		yield item


