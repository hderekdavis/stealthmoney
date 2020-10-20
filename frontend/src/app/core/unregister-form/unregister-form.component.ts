import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-unregister-form',
  templateUrl: './unregister-form.component.html',
  styleUrls: ['./unregister-form.component.scss']
})
export class UnregisterFormComponent implements OnInit {

  public email;

  constructor(private route: ActivatedRoute,
              private backendService: BackendService,
              private toastr: ToastrService,
              private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    })
  }

  unsuscribe() {
    this.backendService.unsuscribe(this.email).subscribe(result => {
      this.toastr.success('You have successfully unsuscribed from the reminders list!', 'Email Reminders');
      this.router.navigateByUrl('/login');
    })
  }

}
