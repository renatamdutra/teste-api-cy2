/// <reference types="cypress" />

describe('lOGIN - Testes de API ServerRest', () => {

    it('Devo fazer login com sucesso', () => {
        cy.request({
            method: 'POST',
            url: 'login',
            body:
            {
                "email": "renata3@qa.com.br",
                "password": "teste"
            },

        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Login realizado com sucesso')
            cy.log(response.body.authorization)
        })
    });
    
});