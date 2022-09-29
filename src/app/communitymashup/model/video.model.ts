import { Attachment } from './attachment.model';
import { CommunityMashupService } from './../communitymashup.service';

export class Video extends Attachment {

  // additional attributes

  constructor(item, public service: CommunityMashupService) {
    super(item, service);
  }

}
