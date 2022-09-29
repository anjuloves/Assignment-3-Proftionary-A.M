import { MetaTag } from './metatag.model';
import { CommunityMashupService } from './../communitymashup.service';

export class Item {

  // reference to service
  communitymashupservice: CommunityMashupService = null;

  // attributes
  ident: string;
  uri: string;
  stringValue: string;
  created: string;
  lastModified: string;
  // relationships - store idents
  connectedBy: string[] = [];
  identifiedBy: string[] = [];
  metaTags: string[] = [];

  // initialize attributes and relations from attribute value pairs in parameter object
  constructor(item, public service: CommunityMashupService) {
    this.communitymashupservice = service;
    // attributes
    this.ident = item['ident'];
    this.uri = item['uri'];
    this.stringValue = item['stringValue'];
    this.lastModified = item['lastModified'];
    this.created = item['created'];
    // relationship connectedBy
    var tmps = item['connectedBy'];
    if (tmps) {
      var tmpsArr = tmps.split(" ");
      tmpsArr.forEach(id => this.connectedBy.push(id));
    }
    // old data models may use connectedTo instead of connectedBy
    var tmps = item['connectedTo'];
    if (tmps) {
      var tmpsArr = tmps.split(" ");
      tmpsArr.forEach(id => this.connectedBy.push(id));
    }
    // relationship identifiedBy
    tmps = item['identifiedBy'];
    if (tmps) {
      var tmpsArr = tmps.split(" ");
      tmpsArr.forEach(id => this.identifiedBy.push(id));
    }
    // relationship metaTags
    tmps = item['metaTags'];
    if (tmps) {
      var tmpsArr = tmps.split(" ");
      tmpsArr.forEach(id => this.metaTags.push(id));
    }
  }

  getMetaTags(): MetaTag[] {
    var result: MetaTag[] = [];
    this.metaTags.forEach(id => result.push(this.service.getItemById(id)));
    return result;
  }

  getMetaTagsAsString(): string {
    var result: string = "";
    this.metaTags.forEach(id => { result = result + "," + this.service.getItemById(id).name } );
    return result;
  }

  // get all items connected from this item
  // (either directly or via connections)
  getConnectedItems() : Item[] {
    var result:Item[] = [];
    this.connectedBy.forEach(id => {
      var connection = this.service.getItemById(id);
      result.push(this.service.getItemById(connection.toId))
    } );
    return result;
  }
  getConnectedToItems() : Item[] {
    return this.getConnectedItems();
  }

  // get all items that connect to this item
  getConnectedFromItems() : Item[] {
    var result:Item[] = [];
    var connections = this.service.getConnections(null);
    connections.forEach(connection => {
      if (connection.toId === this.ident) {
        result.push(this.service.getItemById(connection.fromId));
      }
    } );
    return result;
  }

}
