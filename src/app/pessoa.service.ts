import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pessoa } from './models/pessoa';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  pessoas: Pessoa[] = [];
  baseUrl: string = "http://localhost:8080/pessoas";

  constructor(private http: HttpClient) {}

    getPessoas(): Observable<Pessoa[]>{
      return this.http.get<Pessoa[]>(this.baseUrl);
    }

    save(pessoa: Pessoa): Observable<Pessoa>{
       return this.http.post<Pessoa>(this.baseUrl, pessoa);
    }

    update(pessoa: Pessoa): Observable<Pessoa>{
      let url = `${this.baseUrl}/${pessoa.id}`;
      return this.http.put<Pessoa>(url, pessoa);
    }

    delete(pessoa: Pessoa):Observable<void> {
       let url = `${this.baseUrl}/${pessoa.id}`;
       return this.http.delete<void>(url);
    }

    filterByNomeAndEmail(pessoa: Pessoa[], searchTerm: string): Pessoa[] {
      if (!searchTerm) {
        return pessoa;
      }

      searchTerm = searchTerm.toLowerCase();

      return pessoa.filter(pessoa => {
        return pessoa.nome.toLowerCase().includes(searchTerm) || pessoa.email.toLowerCase().includes(searchTerm);
      });
    }

    //onSearchChange(searchTerm: string): void {
    //  this.filteredPessoa = this.filterByNomeAndEmail(this.pessoas, searchTerm);
    //}

    onSearchChange(pessoas: Pessoa[], searchTerm: string): Pessoa[] {
      return this.filterByNomeAndEmail(pessoas, searchTerm);
    }
}
