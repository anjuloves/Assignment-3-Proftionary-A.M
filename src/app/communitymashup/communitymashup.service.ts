import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { parseString } from 'xml2js';
import { InformationObject } from './model/informationobject.model';
import { MetaTag } from './model/metatag.model';
import { Connection } from './model/connection.model';
import { Organisation } from './model/organisation.model';
import { Content } from './model/content.model';
import { Person } from './model/person.model';
import { Identifier } from './model/identifier.model';
import { Tag } from './model/tag.model';
import { Item } from './model/item.model';
import { Image } from './model/image.model';

@Injectable({
  providedIn: 'root'
})

/*
  This library/service implements an interface to CommunityMashup servers.
  Data is loaded from the CommunityMashup and made available as objects.
  The classes implementing the data model can be found in the "model" subpackage.
  For more information about the data mode see the documentation of the CommunityMashup
  at https://publicwiki.unibw.de/display/MCI/CommunityMashup
  We currently implement an interface to v2 of the CommunityMashup(Server) - which is
  described at https://publicwiki.unibw.de/display/MCI/CommunityMashup2

  TODO
  - error handling in loadFromUrl()
 */

export class CommunityMashupService {

  sourceUrl: string = 'https://cmnet.communitymashup.net/xml/';

  public created: any;
  public lastModified: any;
  public items: Array<any> = [];

  constructor(private http: HttpClient) { }

  getPersons(metaTagString:string): Person[] {
    if (metaTagString == null) {
      return this.itemTypeMap.get('data:person');
    }
    var metaTag: MetaTag = this.getMetaTag(metaTagString);
    if (metaTag == null) { return null; console.log("metatag "+metaTagString+" not known"); }
    // iterate through items metatagged with requested metatag and filter person items
    var itemArr: Item[] = metaTag.getMetaTaggedItems();
    var result: Person[] = [];
    itemArr.forEach(item => { if (item instanceof Person) { result.push(item); }} );
    return result;
  }

  getContents(metaTagString:string) {
    if (metaTagString == null) {
      return this.itemTypeMap.get('data:content');
    }
    var metaTag: MetaTag = this.getMetaTag(metaTagString);
    if (metaTag == null) { return null; console.log("metatag "+metaTagString+" not known"); }
    // iterate through items metatagged with requested metatag and filter content items
    var itemArr = metaTag.getMetaTaggedItems();
    var result : Content[] = [];
    itemArr.forEach(item => { if (item instanceof Content) { result.push(item); } });
    return result;
  }

  getOrganisations(metaTagString:string) {
    if (metaTagString == null) {
      return this.itemTypeMap.get('data:organisation');
    }
    var metaTag: MetaTag = this.getMetaTag(metaTagString);
    if (metaTag == null) { return null; console.log("metatag "+metaTagString+" not known"); }
    // iterate through items metatagged with requested metatag and filter organisation items
    var itemArr = metaTag.getMetaTaggedItems();
    var result : Organisation[] = [];
    itemArr.forEach(item => { if (item instanceof Organisation) { result.push(item); } });
    return result;
  }

  getMetaTags(): MetaTag[] {
    return this.itemTypeMap.get('data:metatag');
  }

  getMetaTag(metaTagString:string): MetaTag {
    let metaTags:MetaTag[] = this.getMetaTags();
    if (metaTags == null) { return null; }
    var result:MetaTag = null;
    metaTags.forEach(metaTag => { if (metaTag.name == metaTagString) { result = metaTag; }} );
    return result;
  }

  getConnections(fromId:string): Connection[] {
    if (!fromId) {
      return this.itemTypeMap.get('data:Connection');
    }
    var result: Connection[] = [];
    // TBD
    return result;
  }

  getItemById(id:string): any {
    return this.itemIdMap.get(id);
  }

  getItemCount(itemType:string) {
    if (itemType == null) {
      return this.itemIdMap.size;
    }
    var tmpArr = this.itemTypeMap.get(itemType);
    if (tmpArr != null) {
      return tmpArr.length;
    }
    return 0;
  }


  loadFromUrl(): Promise<any> {
    console.log("loadFromUrl");
    let self = this;
    let url = this.sourceUrl;
    const promise = this.http.get(url, {
      responseType: 'text'
    })
      .toPromise()
      .then(data => {
        console.log('Loading dataset from ' + url);
        parseString(data, function(err, result) {
          self.created = result['data:DataSet']['$']['created'];
          self.lastModified = result['data:DataSet']['$']['lastModified'];
          self.items = result['data:DataSet']['items'];
          console.log('Finished loading dataset - size=' + self.items.length);
          self.initializeDataSet();
        })
        return data;
      });

    return promise;
  }


  itemIdMap = new Map();
  itemTypeMap = new Map();

  initializeDataSet() {
    // check if DataSet is already initialized ...
    if (this.itemIdMap.size > 0) {
      console.warn("initializeDataSet called with {{this.itemIdMap.size}} elements already stored");
      return;
    }
    // iterate through the items and create correct classes and indexes
    for(let i=0;i<this.items.length;i++) {
      var item = this.items[i]['$'];
      var itemIdent = item['ident'];
      var itemType = item['xsi:type'];
      switch (itemType) {
        case 'data:person':
          item = new Person(item, this);
          break;
        case 'data:content':
          item = new Content(item, this);
          break;
        case 'data:organisation':
          item = new Organisation(item, this);
          break;
        case 'data:metatag':
          item = new MetaTag(item, this);
          break;
        case 'data:tag':
          item = new Tag(item, this);
          break;
        case 'data:identifier':
          item = new Identifier(item, this);
          break;
        case 'data:connection':
          item = new Connection(item, this);
          break;
        case 'data:image':
          item = new Image(item, this);
          break;
        // TBD: still some missing ...
      }
      // now store item object in different Maps for quick retrieval
      // a map indexing items by id
      this.itemIdMap.set(itemIdent, item);
      // a map storing item arrays for the different types
      var typeArr = this.itemTypeMap.get(itemType);
      if (typeArr == null) {
        typeArr = [];
        this.itemTypeMap.set(itemType, typeArr);
      }
      typeArr.push(item);
    }
  }

}
