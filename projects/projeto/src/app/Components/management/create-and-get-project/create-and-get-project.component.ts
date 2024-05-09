import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProjetosService } from '../../../Services/projetos.service';
import { Projeto } from '../../../Interfaces/IProjeto';
import { Router, RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-project',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [RouterLink,
    RouterOutlet,
    MatPaginatorModule,
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRippleModule,
    MatTableModule,
    MatPaginator,
    MatSortModule,
    MatDialogModule,
    FormsModule],
  templateUrl: './create-and-get-project.component.html',
  styleUrls: ['./create-and-get-project.component.css','./create-and-get-project.component.scss'],
})
export class CreateAndGetProjectComponent implements OnInit{
  dataSource!: MatTableDataSource<Projeto>;


  @ViewChild('paginator')
  paginator!: MatPaginator;
  
  @ViewChild(MatSort)
  sort!: MatSort;

  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  projeto!: Projeto;

  message:string;

  error=false;
  submitted = false;

  projetos: Projeto[] = [];

  

  ngOnInit(): void {
    this.projectService.projects$.subscribe(projetos => {
      this.projetos = projetos;
    });
  }

  constructor(private projectService: ProjetosService, private router: Router) {
    this.projeto = {
      id: 0,
      name: '',
      startDate: new Date(),
      endDate: new Date()
    };
    this.message="";
    this.getAllProjects();
    
   }

  createProject(data: any){
    
    //var splitted = data.LimitDate.split("-");
    //let novaDataPlan= splitted[2]+'/'+splitted[1]+'/'+splitted[0];
    this.projectService.createProject(data as Projeto).subscribe(
      (projeto) => {
      this.projeto = projeto;
      this.submitted = true;
      }
    );
  }

  
  add(data: any) {
    this.projectService.createProject(data as Projeto)
      .subscribe({
        next: (projeto) => {
          this.projeto = projeto;
          this.submitted = true;  
        },
        error: (error) => {
          console.error('Erro ao adicionar projeto:', error);
        }
      });
  }



displayedColumns: string[] = ['id', 'name', 'startDate', 'endDate','deletes'];
  columns = [
    {
      columnDef: 'id',
      header: 'Id',
      cell: (row: Projeto) => `${row.id}`
    },
    {
      columnDef: 'name',
      header: 'Name',
      cell: (row: Projeto) => `${row.name}`
    },
    {
      columnDef: 'startDate',
      header: 'Start Date',
      cell: (row: Projeto) => `${row.startDate}`
    },
    {
      columnDef: 'endDate',
      header: 'End Date',
      cell: (row: Projeto) => `${row.endDate}`
    }
  ]
  
 

  


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  fiterByPacking(){
    let filterFunction=
    (data: Projeto, filter: string) : boolean => {
      if(filter){
        if(data.id.toString().indexOf(filter) != -1 || data.name.indexOf(filter) != -1 || data.startDate.toString().indexOf(filter) != -1 || data.endDate.toString().indexOf(filter) != -1){
          return true;
          }
         
          return false;
        
        }else{
          return true;
        }
    };
    return filterFunction;
  }

  sortData(){
    let sortFunction =
    (items: Projeto[], sort: MatSort):Projeto[] => {
      if(!sort.active || sort.direction === ''){
        return items;
      }
      return items.sort((a:Projeto,b:Projeto) => {
        let compartorResult = 0;
       
        switch (sort.active) {
          case 'id':
            compartorResult= a.id.toString().localeCompare(b.id.toString());
            break;
          case 'name':
            compartorResult= a.name.localeCompare(b.name);
            break;
          case 'startDate':
            compartorResult= a.startDate.toString().localeCompare(b.startDate.toString());
            break;
          case 'endDate':
            compartorResult= a.endDate.toString().localeCompare(b.endDate.toString());
            break;
          default:
            compartorResult= a.id.toString().localeCompare(b.id.toString());
            break;
        }
        return compartorResult * (sort.direction === 'asc' ? 1 : -1);
      });
    };

  
  return sortFunction;
  }

  
  getAllProjects(): void {
  this.projectService.projects$.subscribe(
    (projetos) =>  {
      this.projetos = projetos;


    this.dataSource = new MatTableDataSource(this.projetos);
    this.dataSource.sortData = this.sortData();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.fiterByPacking();

    });

  }


}
