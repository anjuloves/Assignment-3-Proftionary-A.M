import { Metainformation } from './metainformation.model';
import { CommunityMashupService } from './communitymashup.service';

export class Email extends MetaInformation {

  // attributes
  address: string;

  constructor(item, public service: CommunityMashupService) {
    super(item, service);
    // attributes
    this.address = item['address'];
  }

}
