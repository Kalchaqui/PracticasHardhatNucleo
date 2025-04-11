import {expect} from "chai"
import hre from "hardhat"

//En los test hay que hacer los escenarios para que las cosas fallen
//Primero se hacen los test que fallan, buscamos que fallen, luego hacemos las que funcionen bien
    describe("Test de Hola Mundo", function(){
    /*function()()=> { //El describe tiene que tener nombre y funcion [()=> cumple la funcion de Function]*/
    
    // (it)  funciona igual que describe tenemos que indicar que vamos a testear
    it("Debe regresar Hola Mundo", async function(){

        //Todo: Deployar el contrato
        const holaMundoContract = await hre.viem.deployContract("HolaMundo")
        console.log(holaMundoContract)
                //Todo: llamar a la función


                    //Todo: Comparar el valor retornado con "Hola Mundo"

    })
})