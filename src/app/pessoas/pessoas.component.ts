import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pessoa } from '../models/pessoa';
import { PessoaService } from '../pessoa.service';

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.css']
})
export class PessoasComponent implements OnInit{

  pessoas: Pessoa[] = [];
  isEditing: boolean = false;

  submited: boolean = false;

  selectedPessoa: Pessoa = {} as Pessoa;
  formGroupPessoa: FormGroup;

  constructor(private pessoaService: PessoaService,
    private formBuilder: FormBuilder
  ) {

    this.formGroupPessoa = formBuilder.group({
      nome: ['',[Validators.required,Validators.minLength(3)]],
      email: ['',[Validators.required,Validators.minLength(5)]],
      telefone: ['',[Validators.required,Validators.minLength(10)]],
      endereco: ['',[Validators.required,Validators.minLength(3)]],
      cidade: ['',[Validators.required,Validators.minLength(3)]],
      cep: ['',[Validators.required,Validators.minLength(8)]],
      estado: ['',[Validators.required,Validators.minLength(2)]],
      busca: ['']
    });
  }

  ngOnInit(): void {
    this.pessoaService.getPessoas().subscribe(
      {
        next: pessoas => this.pessoas = pessoas
      }
    )
  }

  save() {

   this.submited = true;

   if(this.formGroupPessoa.valid){
    if (this.isEditing) {
     this.selectedPessoa.nome = this.formGroupPessoa.get("nome")?.value;
     this.selectedPessoa.email = this.formGroupPessoa.get("email")?.value;
     this.selectedPessoa.telefone = this.formGroupPessoa.get("telefone")?.value;
     this.selectedPessoa.endereco = this.formGroupPessoa.get("endereco")?.value;
     this.selectedPessoa.cidade = this.formGroupPessoa.get("cidade")?.value;
     this.selectedPessoa.cep = this.formGroupPessoa.get("cep")?.value;
     this.selectedPessoa.estado = this.formGroupPessoa.get("estado")?.value;

     this.pessoaService.update(this.selectedPessoa).subscribe({
       next: () => {
         this.formGroupPessoa.reset();
         this.isEditing = false;
         this.submited = false;
       }
     })
   }
   else {
     this.pessoaService.save(this.formGroupPessoa.value).subscribe({
       next: pessoa => {
         this.pessoas.push(pessoa);
         this.formGroupPessoa.reset();
         this.submited = false;
       }
     })
   }
   }
  }

  edit(pessoa: Pessoa) {
    this.selectedPessoa = pessoa;
    this.isEditing = true;
    this.formGroupPessoa.setValue({ "nome": pessoa.nome, "email": pessoa.email, "telefone": pessoa.telefone,
    "endereco": pessoa.endereco, "cidade": pessoa.cidade, "cep": pessoa.cep, "estado": pessoa.estado, "busca": ""});
  }

  delete(pessoa: Pessoa) {
    this.pessoaService.delete(pessoa).subscribe({
      next: () => {
        this.pessoas = this.pessoas.filter(p => p.id !== pessoa.id)
      }
    })
  }

  cancel() {
    this.formGroupPessoa.reset();
    this.isEditing = false;
    this.submited = false;
  }

  cancelSearch() {
    this.formGroupPessoa.get('busca')?.reset();
    this.onSearchChange();
  }

  select(pessoa: Pessoa) {
    this.selectedPessoa = pessoa;
    this.formGroupPessoa.setValue({ "nome": pessoa.nome, "email": pessoa.email, "telefone": pessoa.telefone,
    "endereco": pessoa.endereco, "cidade": pessoa.cidade, "cep": pessoa.cep, "estado": pessoa.estado, "busca": ""});
  }

  onSearchChange(): void {
    const searchTerm = this.formGroupPessoa.get('busca')?.value;
    if (searchTerm) {
      this.pessoas = this.pessoaService.onSearchChange(this.pessoas, searchTerm);
    } else {
      // Se o campo de busca estiver vazio, recarregue todas as pessoas
      this.pessoaService.getPessoas().subscribe({
        next: pessoas => this.pessoas = pessoas
      });
    }
  }

  get nome(): any {
      return this.formGroupPessoa.get("nome");
  }

  get email(): any {
    return this.formGroupPessoa.get("email");
  }

  get telefone(): any {
    return this.formGroupPessoa.get("telefone");
}

  get endereco(): any {
    return this.formGroupPessoa.get("endereco");
  }

  get cidade(): any {
    return this.formGroupPessoa.get("cidade");
  }

  get cep(): any {
    return this.formGroupPessoa.get("cep");
  }

  get estado(): any {
    return this.formGroupPessoa.get("estado");
  }

  get busca(): any {
    return this.formGroupPessoa.get("busca");
  }
}
