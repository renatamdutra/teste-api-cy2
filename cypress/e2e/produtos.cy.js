/// <reference types="cypress" />
import contrato from '../contracts/produtos.contract'

describe ('Teste da funcionalidade produtos', () => {
    let token
    before(() => {
        cy.token('fulano@qa.com', 'teste').then (tkn => {token = tkn})
    });

    it.only('Deve validar contrato de produtos', () => {
        cy.request('produtos').then(response => {
            return contrato.validateAsync(response.body)
        })
    });


    it('Listar produtos', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
        }).then((response) =>{
            expect(response.body.produtos [2].nome).to.equal('Iphone XR2')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(15)
        })
        
    });

    it('Cadastra produto', () => {
        let produto = `Produto EBAC ${Math.floor (Math.random () * 100000)}`
        cy.request({
            method: 'POST',
            url: 'produtos',
            body: {
                "nome": "Produto Renata4",
                "preco": 470,
                "descricao": "Mouse",
                "quantidade": 100
              },
              headers: {authorization: token}

        }).then((response) =>{
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')

        })
        
    });
    
    it('Deve validar mensagem de erro ao cadastrar produto repetido', () => {
        cy.cadastrarProduto(token, "produto novo", 240, "Descrição do produto novo", 180)
        .then((response) =>{
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Já existe produto com esse nome')
        })
    });

    it('Deve editar um produto já cadastrado', () => {
        cy.request('produtos').then(response => {
            let id = response.body.produtos[0]._id
            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: {authorization: token},
                body:
                {
                    "nome": "Editado Logitech MX Vertical",
                    "preco": 470,
                    "descricao": "Mouse 5",
                    "quantidade": 381
                  }
            }).then(response => {
                expect(response.body.message).to.equals('Registro alterado com sucesso')
            })
        })
        
    });

    it('Deve cadastrar um produto cadastrado previamente', () => {
        let produto = `Produto EBAC ${Math.floor (Math.random () * 100000)}`
        cy.cadastrarProduto(token, produto, 240, "Descrição do produto novo", 180)
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: {authorization: token},
                body:
                {
                    "nome": produto,
                    "preco": 40,
                    "descricao": "Mouse 9",
                    "quantidade": 381
                  }
            }).then(response => {
                expect(response.body.message).to.equals('Registro alterado com sucesso')
            })
        })
        
    });

    it('Deve deletar o produto previamente cadastrado', () => {
        let produto = `Produto EBAC ${Math.floor (Math.random () * 100000)}`
        cy.cadastrarProduto(token, produto, 240, "Descrição do produto novo", 180)
        .then (response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `produtos/${id}`,
                headers: {authorization: token},
            }).then(response => {
                expect (response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equals(200)
            })

        })
    });
});