import { Inject, Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder , FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';
import { ManageUserService } from 'src/app/services/manage-user.service';
import { User } from 'src/app/models/app.models';
import { PasswordValidator } from './password.validator';
import { REGEX } from 'src/app/constants/constants';
import {throttle} from "lodash";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private userService: ManageUserService,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User) { 
      this.checkDuplicate = throttle(this.checkDuplicate.bind(this), 300)
    }

  ngOnInit() {
    this.createForm();
    if(this.data){
      this.userForm.setValue(this.data);
    }
  }
  createForm(){
    this.userForm = this.fb.group({
      id: [null],
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      password:['', [Validators.required, Validators.minLength(6), PasswordValidator.strong]],
      email: ['', [Validators.required,Validators.email]],
      gender: ['Male'],
    })
  }

  onClear() {
    this.userForm.reset();
    this.notificationService.reset('Form Clear', 'Reset');
  }

  onSubmit() {
    if (this.userForm.valid) {
      if (!this.userForm.get('id').value) {
        this.userService.addUser({...this.userForm.value, id: new Date().toISOString()});
        this.notificationService.success('New User added', 'Submit');
      } else {
        this.userService.updateUser(this.userForm.value);
        this.notificationService.update('User details updated', 'Update');
      }
      this.onDialogClose();
    }
  }

  onDialogClose() {
    this.dialogRef.close();
  }

  onBlur(){
    console.log(this.userForm.controls['email'].errors)
  }

  getPasswordError() {
    const password = this.userForm.get('password').value;
    if(!(REGEX.number.test(password))){
      return "Password should contain at least one number character";
    }
    if(!(REGEX.Upper.test(password))){
      return "Password should contain at least one uppercase character";
    }
    if(!(REGEX.Lower.test(password))){
      return "Password should contain at least one lowercase character";
    }

    if(!REGEX.Special.test(password)){
      return "Password should contain at least one Special character";
    }
    return 'Password is invalid'
  }

  checkDuplicate(type){
    if (type === 'email'){
      if(this.userService.emailExist(this.userForm.get('email').value)){
        this.userForm.controls['email'].setErrors({'duplicate': true})
      }
    }else{

      if(this.userService.userNameExist(this.userForm.get('userName').value))
      this.userForm.controls['userName'].setErrors({'duplicate': true})
    }

  }

}
