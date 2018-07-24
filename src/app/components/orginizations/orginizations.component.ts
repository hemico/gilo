import { Component, OnInit } from '@angular/core';
import { OrgService } from '../../services/org.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-orginizations',
  templateUrl: './orginizations.component.html',
  styleUrls: ['./orginizations.component.css']
})
export class OrginizationsComponent implements OnInit {


  addIconEnabled = true;
  EnableAddForm = false;
  Organizations;
  organization = {
    Name: '',
    ManagerName: '',
    Id: '',
    Email: '',
    Phone: '',
    Mobile: '',
    Fax: '',
    Address: '',
  };

  constructor(
    private orgService: OrgService,
    private fms: FlashMessagesService
  ) { }

  ngOnInit() {
    this.getOrganizations();
  }

  addIconFun() {
    if (this.addIconEnabled === true) {
      this.addIconEnabled = false;
      this.EnableAddForm = true;
      return 0;
    }
    if (this.addIconEnabled === false) {
      this.addIconEnabled = true;
      this.EnableAddForm = false;
      return 0;
    }
  }

  addOrganization() {
    this.orgService.addOrganization(this.organization)
      .then((success) => {
        if (success.id !== null) {
          this.addIconEnabled = true,
            this.EnableAddForm = false,
            this.emptyObject(),
            this.fms.show('הוספת ארגון בהצלחה', { cssClass: 'success', timeout: 3000 });
        }
      }
      )
      .catch((err) => console.log(err));
  }

  emptyObject() {
    this.organization.Name = '';
    this.organization.ManagerName = '';
    this.organization.Id = '';
    this.organization.Email = '';
    this.organization.Phone = '';
    this.organization.Mobile = '';
    this.organization.Fax = '';
    this.organization.Address = '';
  }

  getOrganizations() {
    this.orgService.getOrganizations()
      .subscribe(data => {
        this.Organizations = data;
      });
  }

  DeleteOrginization(id , name) {
    this.orgService.DeleteOrganization(id)
      .then((success) => {
        this.fms.show(' מחקת ארגון ' + name + ' בהצלחה ', { cssClass: 'primary', timeout: 3000 });
        console.log(success);
      })
      .catch((err) => {
        this.fms.show(err, { cssClass: 'danger', timeout: 3000 });
      });
  }


}
