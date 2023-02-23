/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {
     let token
     before(() => {
         cy.token('renata3@qa.com.br', 'teste').then (tkn => {token = tkn})
     });

    it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
    });

    it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) =>{
               expect(response.body.usuarios [2].nome).to.equal('Renata Machado1')
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(50)
           })
    });

    it('Deve cadastrar um usuário com sucesso', () => {
     let usuario = `Usuario EBAC ${Math.floor (Math.random () * 10000000)}`
     
         cy.request({
            method: 'POST',
            url: 'usuarios',
            headers: {authorization: token},
            body: {
               "nome": usuario,
               "email": "renata15@qa.com.br",
               "password": "teste",
               "administrador": "true"
              },
              failOnStatusCode: false
          }).then((response) =>{
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')

        })
    });

    it('Deve validar um usuário com email inválido', () => {
          
    });

    it('Deve editar um usuário previamente cadastrado', () => {
          cy.request('usuarios').then(response => {
               let id = response.body.usuarios[0]._id
               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    headers: {authorization: token},
                    body: 
                    {
                         "nome": "usuario t",
                         "email": "renata5o",
                         "password": "teste",
                         "administrador": "true"
                    },
                    failOnStatusCode: false
                    
               })
          })
    });

    it('Deve deletar um usuário previamente cadastrado', () => {
     let usuario = `Usuario EBAC ${Math.floor (Math.random () * 10000000)}`
     cy.cadastrarUsuario(token, usuario, "renata@teste2.com", "teste", "true")
     .then((response) =>{
          let id = response.body._id

          cy.request({
               method: 'DELETE',
               url: `usuarios/${id}`,

          }).then ((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Nenhum registro excluído')
            cy.log(response.body.authorization)
          })
     })
    });


});