class UnprocessableEntityErrors{
    messages = {};

    constructor(errorJson){
        this.montarErros(errorJson)
    }


    getMessages(){
        return this.messages;
    }
    
    montarErros(errorJson){
        this.uniqueError(errorJson)
    }
    

    uniqueError(error){
        let params = {}
        if(error.keyPattern && error.keyValue){
            for(var key in error.keyPattern){
                if(error.keyValue[key]){
                    params = {[key]: error.keyValue[key]}
                }
            }
        }

        this.messages["uniqueError"] = {
            message:`O parametro informado ja esta sendo utilizado.`,
            parametro_informado: params
        };
    }

    getMessages(){
        return this.messages;
    }
}

module.exports = UnprocessableEntityErrors;