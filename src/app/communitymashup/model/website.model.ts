import { Metainformation } from './metainformation.model';
import { CommunityMashupService } from './communitymashup.service';

export class WebSite extends MetaInformation {

  // additional attributes
  title: string;
  longUrl: string;
  shortenedUrl: string;

  constructor(item, public service: CommunityMashupService) {
    super(item, service);
    // attributes
    this.title = item['title'];
    this.longUrl = item['longUrl'];
    this.shortenedUrl = item['shortenedUrl'];
  }

}
