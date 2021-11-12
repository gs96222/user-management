import { AfterViewInit, Component, OnInit, ViewChild, } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserFormComponent } from '../user-form/user-form.component';
import { ManageUserService } from 'src/app/services/manage-user.service';
import { User } from 'src/app/models/app.models';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {
  userListData:  MatTableDataSource<User>;
  searchKey: string;
  // array of columns
  displayedColumns = ['fullName', 'userName', 'email', 'gender', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private userService: ManageUserService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
  ) {
   }

  ngOnInit() {
    this.createDataSource();
  }

  ngAfterViewInit(){
    this.createDataSource();
  }

  createDataSource(){
    this.userListData = new MatTableDataSource(this.userService.usersList);
    this.userListData.sort = this.sort;
    this.userListData.paginator = this.paginator;
   }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.userListData.filter = this.searchKey.trim().toLowerCase();
  }

  onCreateEmployee() {
    this.DialogConfig();
  }

  onEdit(rowData) {
    this.DialogConfig(rowData);
  }

  onDelete(row) {
    const config = new MatDialogConfig();
    config.width = '350px';
    config.disableClose = true;
    config.panelClass = 'confirm-dialog-container';
    config.data = {
      message: "Are you sure to delete employee?"
    };
    config.position = {top: '100px'};
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, config);

    dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.userService.deleteUser(row);
          this.userListData.data = this.userService.usersList;
          this.notificationService.delete('! Employee Successfully removed.', 'Deleted');
        }
      });
  }

  // define dialog configuration
  private DialogConfig(data = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(UserFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      this.userListData.data = this.userService.usersList;
    });
    
  }

}
