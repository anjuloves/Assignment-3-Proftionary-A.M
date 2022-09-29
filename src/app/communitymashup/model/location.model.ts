import { Metainformation } from './metainformation.model';
import { CommunityMashupService } from './communitymashup.service';

export class Location extends MetaInformation {

  // attributes
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  country: string;
  longitude: string;
  latitude: string;

  constructor(item, public service: CommunityMashupService) {
    super(item, service);
    // attributes
    this.street = item['street'];
    this.houseNumber = item['houseNumber'];
    this.zipCode = item['zipCode'];
    this.city = item['city'];
    this.country = item['country'];
    this.longitude = item['longitude'];
    this.latitude = item['latitude'];
  }

}
