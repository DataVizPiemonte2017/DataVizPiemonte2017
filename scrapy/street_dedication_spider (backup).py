#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
import csv
import overpass as op
import pandas as pd
import numpy as np
import scrapy

api = op.API(timeout=600)

# ===== Define useful functions =====

def extract_streets_name_dic(dataJson):
    """Extract the name of the streets from the full JSON and save the id"""
    #streetsToClean=[]
    content = {}
    for element in dataJson['elements']:
        #check if tags exist
        if 'tags' in element:
            idStreet = element['id']
            street = element['tags']['name']
            #create a new dictionary
            content[idStreet] = street
            #streetsToClean.append(street)

    return content


from collections import defaultdict
def riverse_merge_dict(listDic):
    """Function to reverse key:value in the dictionary above.
    Necessary because some the default dict is id:street_name but some street names are repeated with different id. This function first reverses the dict (street_name:id).
    For loop checks if a street has already an entry with same street_name and in that case appends the new id to that element -> street_name:[id1,id2]"""
    reversed_dict = defaultdict(list)
    for key,value in listDic.iteritems():
        reversed_dict[value].append(key)
    print len(reversed_dict)
    return dict(reversed_dict)


def save_file(cityKey,cityJson):
    with open('%s.json' % cityKey, 'w') as f: 
        json.dump(cityJson, f)
        

def open_file(cityKey):
    with open('%s.json' % cityKey ) as json_data:
        cityJson = json.load(json_data)
        print(cityJson) 
        return cityJson


from collections import Counter
def token_streets(streetsDic):
    """Splits the words/tokens that compose a street.
    E.g. 'corso vittorio emanuele' -> ['corso', 'vittorio', 'emanuele']"""
    streets = dict(streetsDic)
    lsd = {} 
    listToken = []
    listStreets = streetsDic.keys()
    for i in listStreets:
        tokens = i.split()
        for token in tokens:
            listToken.append(token)
    counter= Counter(listToken)
    
    return counter


# ===== Fetch data, process it and output a clean csv file =====

# Select city to test - I am using a small place (my home town) to keep it fast
cityKey = "Oderzo"

# Call Google Custom Search API
request = 'area[name=%s];way(area)[highway][name];out;' % cityKey
cityJson = api.Get(request, responseformat="json")
save_file (cityKey,cityJson)

#save original json on file
cityJson = save_file(cityKey, cityJson)
print(cityJson)

# Load file
cityJson = open_file(cityKey)

# Extract name and id
dicIdName = extract_streets_name_dic(cityJson)
print(dicIdName)

# Reverse them
dicNameKey = riverse_merge_dict(dicIdName)
#df_dicNameKey = pd.DataFrame.from_dict(dicNameKey, orient='index')
print(dicNameKey)

# Create statitstics token
counterOcc= token_streets(dicNameKey)

# Display statistics
#df = pd.DataFrame(counterOcc)
df = pd.DataFrame.from_dict(counterOcc, orient='index')
df
df = df.rename(columns = {0 :'Occurences'})
#df.describe()
df.sort_values( 'Occurences',ascending=False)
df[df["Occurences"] > 2].sort_values( 'Occurences',ascending=False)

# Accordingly, compile a list of tokens to clean from the street name
setRemoveKey = ["strada",
         "via",
         "corso",
         "piazza",
         "ciale",
         "borgata",
         "provinciale",
         "casale",
         "tetto",
         "vicolo",
         "località",
         "colle",
         "ponte", "tetti", "frazione", "sentiero", "del", "dello", "della","di", "rocca"]

# Prepare list for Google API
wikiTest = list()

for street in dicNameKey:
    lowerStreet=street.lower()
    streetToken = lowerStreet.split()
    streetTokenL = list(streetToken)
    for x in streetTokenL:
        #print x
        if x in setRemoveKey:
            streetTokenL.remove(x)
    cleaned = ' '.join(streetTokenL)
    wikiTest.append(cleaned)
    
print wikiTest

#Prepare shorter list for testing purposes
wikiTest_short = wikiTest[:10]
print(wikiTest_short)

#Check with Google if there is a Wikipedia Italia link within the first 8 results

from google import search
#list_to_google = wikiTest
list_to_google = wikiTest_short
start_urls = []
for i in list_to_google:
    i = i.encode('utf-8')
    for url in search(i, tld='it', lang='it', stop=8):
        if url.startswith('https://it.wikipedia.org'):
            #take the first and then exit  
            print(url)
            start_urls.append(url)
            break
# success = len(start_urls)
# total = len(list_to_google)
# percent = (float(success)/float(total))*100
# print(str(percent) '% of wiki_links found')
print(start_urls)

# ====== Scrape information from Wikipedia and Wikidata =====

#A. Define the data to be scraped
class StreetDedicationItem(scrapy.Item):
	wiki_url = scrapy.Field()
	name = scrapy.Field()
	wd_url = scrapy.Field()
	instance_type = scrapy.Field()
	gender = scrapy.Field()
	date_of_birth = scrapy.Field()
 	# date_of_death = scrapy.Field()
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
			#{'name':'date_of_death', 'code':'P570'}
			]

		# Extract instance type
		p_instance = '//*[@id="P31"]/div[2]/div/div/div[2]/div[1]/div/div[2]/div[2]/a/text()'
		instance_type = response.xpath(p_instance).extract()
		item['instance_type'] = instance_type

		# If human extract additional data
		if instance_type == [u'human']:

			
			for prop in property_codes_human:

				link_html = ''
				if prop.get('link'):
					link_html = '/a'
				sel = response.xpath(p_template.format(code=prop['code'], link_html=link_html))
				if sel:
					item[prop['name']] = sel[0].extract()

			# Send data back to item
			# yield item

			# Chain next request: go back to Wikipedia and extract picture and bio
			request = scrapy.Request(
				#wiki_url,
				item['wiki_url'],
				callback=self.parse_human,
				dont_filter=True)
			request.meta['item'] = item
			yield request

		# If not human send data back to item
		else:
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


