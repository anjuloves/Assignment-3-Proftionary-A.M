import { Attachment } from './attachment.model';
import { CommunityMashupService } from './../communitymashup.service';

export class Document extends Attachment {

  // additional attributes

  constructor(item, public service: CommunityMashupService) {
    super(item, service);
  }

}
