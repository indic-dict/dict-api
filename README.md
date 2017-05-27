[Table of contents generated using this app](https://tableofcontents.herokuapp.com)

- [Introduction](#introduction)
   - [Motivations](#motivations)
- [Detailed design](#detailed-design)
   - [Intro to the data](#intro-to-the-data)
   - [Web API](#web-api)
     - [General reference and tips](#general-reference-and-tips)
     - [Potential simplification](#potential-simplification)
   - [UI](#ui)
- [Implementation](#implementation)
   - [Ideas](#ideas)
- [Design choices](#design-choices)
- [Deployment](#deployment)
   - [Database repilicas](#database-repilicas)
   - [UI deployments](#ui-deployments)

# Introduction
We seek to provide a functional rest-api based webapp to access various dictionaries stored in a database. We intend for the database to serve a huge, eclectic mix of dictionaries which are not already available in a single spot.

## Motivations
(in decreasing order of importance)

* Any web developer should be able to make simple REST-API calls to our backend to easily get entries for a lot of dictionaries (most of whom aren't already available in such manner).
  * Imagine being able to highlight a word and use the context menu while reading a text to get it's meanings, grammatical info (linga, vibhakti, vachana, puruSha) etc..
  * Imagine being able to make simple commentaries (like [this](http://www.valmikiramayan.net/utf8/baala/sarga3/bala_3_frame.htm)) with a few mouse clicks per word (selecting the meaning most appropriate to the context).
* End users ( sanskrit students and scholars ) should be able to thoroughly investigate a term in the dictionaries using just a browser, without having to install any software.
* End users should be able to point out errors (eg. via a link).
* Users should be able to log in and submit new words to a "user dictionary" (as in <sanskritdictionary.de> or wiktionary, but using convenience of openId and less fuss.)

# Detailed design
## Intro to the data
* We have several projects which collect dictionaries for various languages ([link](https://github.com/search?q=org%3Asanskrit-coders+stardict)). These dictionaries are further subcategorized by topic, entry language etc.. (eg. Ayurveda, sa-german etc..).
* Simplest programmatic current way to access dictionary data is through babylon files ([some here](https://github.com/search?utf8=%E2%9C%93&q=user%3Asanskrit-coders+extension%3Ababylon_final&type=Code) - open one to check out the format).
* We ultimately have the (extensible) JSON structure exemplified below for each entry:
```
{
  "_id": "stardict-sanskrit__sa-head__sa-entries__vAchaspatyam-sa__vAchaspatyam-sa__22721",
  "_rev": "1-bce5a5d86829ba751b32be7839771d42",
  "entry": {
    "text": "{@कटि(टी)@}¦ स्त्री कट-इन्। <br><br>१ श्रोणिदेशे(काकांल)। कृदिकारान्तत्वात् वा ङीप्। <br>“सहासनमभिप्रेप्सुरुत्कृष्टस्पाप्यपकृ-ष्टजः। अट्यां कृताङ्कोनिर्वास्यः” मनुः। <br>“कटिश्च तस्या-तिकृतप्रमाणा” भा॰ व॰ <br><br>१० <br><br>५४ । <br>“सव्येन च कटीदेशेगृह्य वाससि पाण्डवः” भा॰ आ॰ <br><br>१६ <br><br>३ <br>“कटिस्तु हरतेमनः” सा॰ द॰। तत्र तच्छब्दस्य ग्राम्यत्वमुक्तम्। ङीबन्तः<br><br>२ पिप्पल्पां स्त्री मेदि॰"
  },
  "jsonClass": "DictEntry",
  "location": {
    "dictionaryId": "stardict-sanskrit__sa-head__sa-entries__vAchaspatyam-sa__vAchaspatyam-sa",
    "entryNumber": 22721,
    "jsonClass": "DictLocation",
  },
  "headwords": [
    {
      "text": "kaTi"
    },
    {
      "text": "कटि"
    }
  ]
}
```

* For dictionary metadata, we have the following structure:
```
{
"_id": "amarakosha",
"name": "अमरकोशः",
"authors": ["अमरसिंहः"],
"licenseLink": "http://some-link",
"canonicalSource": "http://some-link",
"categories": ["sanskrit to sanskrit", "thesaurus"],
"issuePage": "https://github.com/sanskrit-coders/stardict-sanskrit/issues"
}
```

## Web API
Actually, whatever couchdb provides is enough. 
* Get a particular dictionary entry: [link](http://vedavaapi.org:5984/dict_entries/stardict-sanskrit__sa-head__sa-entries__amara-onto__amara-onto__0).
* Get a list of 10 entries starting with  : [get all](http://vedavaapi.org:5984/dict_entries/_design/index_headwords/_view/index_headwords?limit=10&reduce=false&inclusive_end=true&start_key=%22%E0%A4%95%E0%A4%9F%E0%A4%BF%22)

### General reference and tips
* couchdb [documentation](http://docs.couchdb.org/en/2.0.0/api/database/find.html) for the general find call.

### Potential simplification
In the ideal case, we would have the following (from the view of simplicity) (in decreasing order of importance):

* `/words/xyz` yields the appropriate entry if it exists; or returns a list of n=40 words starting with that substring 'xyz' - from all dictionaries.
* `/dictionaries/dictionaryId/words/xyz` - same as above, restricted to one dictionary.
* `/dictionaries/dictionaryCategory/words/xyz` does the same - except for all dictionaries in a given category.
* `/words_with_substring/xyz` etc..

## UI
(in decreasing order of importance)

* Should be mobile friendly, with flowing text.
* Searching:
  * User is able to search for a word in multiple dictionaries.
  * As a user types, a dropdown of suggestions appear, thereby avoiding unnecessary strain.
  * User can restrict search to certain dictionaries or dictionary categories.
  * Complex (ok if slower) searches based on substrings (or eventually regular expressions), matching headwords.
    * Complex search within entries.
* Results:
  * A term can appear in many dictionaries, the user should be able to quickly navigate to the dictionary or dictionary-category of his choice.
  * Some history (what words were recently looked up).
* Stats:
  * Collect site use stats (eg. using google analytics).
  * Submit lookup stats to the server.
* Example from Goldendict (desktop) [here](http://imgur.com/a/Tj6OZ?).


# Implementation
## Ideas
* Use no-sql database with good replication characteristics, like couchdb. couchdb already provides some simple API, and it is extensible.
* Leverage the rest api that couchdb provides to the extant possible.
* Use offline catching intelligently to minimize communicating with the server. Caching ideas:
  * Headword-dictionary mappings

# Design choices


# Deployment
## Database repilicas
* You want to host a repilica and make things faster for folks in your geographical area? Just open an issue in this project and let us know.
* Ahmedabad, IN <http://vedavaapi.org:5984/dict_entries/_all_docs>
* Bay area, USA (dev machine, unstable) <http://vvasuki.hopto.org:5984/dict_entries/_all_docs>

## UI deployments
* You can use it right off github!
* You want to host copies and make things faster for folks in your geographical area? Just open an issue in this project and let us know.
