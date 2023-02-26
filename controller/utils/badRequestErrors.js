class BadRequestErrors{
    messages = {};

    constructor(errorJson){
        this.montarErros(errorJson)
    }


    getMessages(){
        return this.messages;
    }
    
    montarErros(errorJson){
        if(errorJson.name && errorJson.message){
            const nomeErro = errorJson.name
            this.messages[nomeErro] = [];


            if(errorJson.name === "ValidatorError"){
                this.validatorError(errorJson, nomeErro)
            }else if(errorJson.name === "CastError"){
                this.castError(errorJson,nomeErro)
            }

            if(this.messages[nomeErro].length == 0){
                delete this.messages[nomeErro]
            }

        }else{
            for(const key in errorJson){
                this.messages[key] = [];

                const erro = errorJson[key]

                if(erro.name === "ValidatorError"){
                    this.validatorError(erro, key)
                }else if(erro.name === "CastError"){
                    this.castError(erro,key)
                }

                if(this.messages[key].length == 0){
                    delete this.messages[key]
                }
            }
        }
    }
    
    validatorError(error, nomeObjeto){
        const message = error.message;
        if(!this.messages[nomeObjeto].includes(message)){
            this.messages[nomeObjeto].push(message)
        }
    }

    castError(error,nomeObjeto) {
        const message = error.message;
        const path = error.path;
        let mensagemFinal;

        if(message.includes("Cast to Number")){
            mensagemFinal = `parametro "${path}" necessita ser do tipo numerico!`
        }
        
        if(message.includes("Cast to [ObjectId]")){
            console.log(message)
            mensagemFinal = `parametro "${path}" necessita ser do tipo ObjectId!`
        }

        if(!this.messages[nomeObjeto].includes(mensagemFinal)){
            this.messages[nomeObjeto].push(mensagemFinal)
        }
    }

}

module.exports = BadRequestErrors;