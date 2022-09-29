import { Metainformation } from './metainformation.model';
import { CommunityMashupService } from './communitymashup.service';

export class Event extends MetaInformation {

  // attributes
  eventDate: string;

  constructor(item, public service: CommunityMashupService) {
    super(item, service);
    // attributes
    this.eventDate = item['date'];
  }

}
