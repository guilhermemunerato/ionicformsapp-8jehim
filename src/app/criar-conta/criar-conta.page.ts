import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario';

//Importações de validaçõoes personalizadas 
//Comparação das senhas 
import { ComparaValidator } from '../validators/compara-validator';
//Validador de CPF
import { CpfValidator } from '../validators/cpf-validator';

@Component({
  selector: 'app-criar-conta',
  templateUrl: './criar-conta.page.html',
  styleUrls: ['./criar-conta.page.scss'],
})
export class CriarContaPage implements OnInit {

  //Recebe os dados do usuário
  public usuario: Usuario;

  public formCriarConta: FormGroup;

  public mensagens_validacao = {
    nome: [
      { tipo: 'required', mensagem: 'O campo Nome é obrigatório' },
      { tipo: 'minlength', mensagem: 'A senha deve ter no mínimo 4 caracteres' }
    ],
    sexo: [
      { tipo: 'required', mensagem: 'O campo Sexo é obrigatório' },
    ],
    cpf: [
      { tipo: 'required', mensagem: 'O campo CPF é obrigatório' },
      { tipo: 'invalido', mensagem: 'CPF é inválido' }
    ],
    email: [
      { tipo: 'required', mensagem: 'O campo E-mail é obrigatório' },
      { tipo: 'email', mensagem: 'E-mail é inválido' },
    ],
    dataNascimento: [
      { tipo: 'required', mensagem: 'O campo Data de Nascimento é obrigatório' },
    ],
    senha: [
      { tipo: 'required', mensagem: 'É obrigatório digitar a senha' },
      { tipo: 'minlength', mensagem: 'A senha deve ter  6 caracteres' },
      { tipo: 'maxlength', mensagem: 'A senha deve ter  8 caracteres' },
    ],
    senhaConfirmacao: [
      { tipo: 'required', mensagem: 'É obrigatório digitar a senha' },
      { tipo: 'minlength', mensagem: 'A senha deve ter 6 caracteres' },
      { tipo: 'maxlength', mensagem: 'A senha deve ter 8 caracteres' },
      { tipo: 'comparacao', mensagem: 'A senha deve ser igual..!'}
    ]
  }

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public router: Router,
    public usuarioService: UsuarioService
  ) {

    this.formCriarConta = formBuilder.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      cpf: ['', Validators.compose([Validators.required, CpfValidator.cpfValido])],
      sexo: ['', Validators.compose([Validators.required])],
      dataNascimento: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      senha: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(8), Validators.required])],
      senhaConfirmacao: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(8), Validators.required])]
    }, {
      validator: ComparaValidator('senha', 'senhaConfirmacao')
    });
  }

  ngOnInit() {
  }

  public criarConta() {
    if (this.formCriarConta.valid) {
      this.usuario = this.formCriarConta.value as Usuario;
      delete this.usuario['senhaConfirmacao'];

      if (this.usuarioService.salvar(this.usuario)){
        this.alertCadastro('Sucesso', 'Usuário salvo com sucesso');
        this.router.navigateByUrl('/home');
      } else {
        this.alertCadastro('Erro', 'Erro ao salvar o usuário');
      }
    } else {
      this.alertCadastro('Erro', 'Formulário inválido, confira os dados');
    }
  }

  async alertCadastro(titulo, msg) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

}
