🚀 Introducción a Hardhat 3 Alpha
Este tutorial te guía por los grandes cambios que trae Hardhat 3:

Pruebas directamente en Solidity (compatibles con Foundry).

Flujo de trabajo multichain.

Nuevo sistema de compilación.

Integración con el test runner de Node.js y la librería viem.

Mejoras generales para adaptarse al ecosistema actual.

Nota: Hardhat 3 está en fase Alpha, por lo que puede cambiar. No se recomienda migrar proyectos todavía, pero sí puedes probarlo y dar feedback en su grupo de Telegram.

🧱 Cómo empezar
Requisitos:
Node.js v22 o superior

npm o pnpm

Comandos para crear un proyecto de ejemplo:
bash
Copiar
Editar
mkdir hardhat3-alpha
cd hardhat3-alpha
npm init -y
npx hardhat@next --init
Durante la inicialización:
Acepta el directorio actual como ubicación.

Activa ESM (módulos de ES).

Elige el Node Test Runner y viem para pruebas.

Instala las dependencias necesarias.

✅ El test runner de Node.js es rápido y sin dependencias. viem es tipado, moderno y recomendado, aunque Mocha y Ethers.js siguen siendo compatibles.

🧪 Pruebas en Solidity
Hardhat 3 permite escribir pruebas directamente en Solidity, como en Foundry:

Puedes usar forge-std y PRBTest.

Soporta pruebas unitarias, fuzzing e invariantes.

Ejemplo de contrato:

solidity
Copiar
Editar
contract Counter {
  uint public x;

  event Increment(uint by);

  function inc() public {
    x++;
    emit Increment(1);
  }

  function incBy(uint by) public {
    require(by > 0, "incBy: increment should be positive");
    x += by;
    emit Increment(by);
  }
}
Ejemplo de prueba en Solidity (Counter.t.sol):

solidity
Copiar
Editar
contract CounterTest is Test {
  Counter counter;

  function setUp() public {
    counter = new Counter();
  }

  function test_InitialValue() public view {
    require(counter.x() == 0, "Initial value should be 0");
  }

  function testFuzz_Inc(uint8 x) public {
    for (uint8 i = 0; i < x; i++) {
      counter.inc();
    }
    require(counter.x() == x, "Should equal x");
  }

  function test_IncByZero() public {
    vm.expectRevert();
    counter.incBy(0);
  }
}
📌 Detalles:
Funciones que empiezan con test y no tienen parámetros = unit test.

Las que sí tienen parámetros = fuzz test (inputs aleatorios).

Usa "cheatcodes" como vm.expectRevert() o vm.roll().

🔍 Stack Traces
Si una prueba falla, verás la traza del error en Solidity. Ejemplo:

solidity
Copiar
Editar
// Comentamos expectRevert para forzar un error
function test_IncByZero() public {
  // vm.expectRevert();
  counter.incBy(0);
}
Output esperado:

php
Copiar
Editar
Reason: revert: incBy: increment should be positive
at Counter.incBy (Counter.sol:15)
at CounterTest.test_IncByZero (Counter.t.sol:27)
🧪 Pruebas en TypeScript
Aunque Solidity está bien para unit tests, para pruebas más complejas o simulaciones realistas, puedes usar TypeScript:

Ejemplo:

ts
Copiar
Editar
describe("Counter", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  it("La suma de los eventos Increment debe coincidir con x", async function () {
    const vault = await viem.deployContract("Counter");

    for (let i = 1n; i <= 10n; i++) {
      await vault.write.incBy([i]);
    }

    const events = await publicClient.getContractEvents({
      address: vault.address,
      abi: vault.abi,
      eventName: "Increment",
      fromBlock: 0n,
      strict: true,
    });

    let total = 0n;
    for (const event of events) {
      total += event.args.by;
    }

    assert.equal(total, await vault.read.x());
  });
});
Para ejecutar pruebas:

bash
Copiar
Editar
npx hardhat test node        # solo tests de TypeScript
npx hardhat test             # todos los tests (Solidity + TS)
🌐 Capacidades Multichain
Hardhat 2 asumía que trabajarías con una sola red (como Ethereum). En cambio, Hardhat 3:

Te deja elegir el tipo de cadena.

Puedes trabajar con múltiples redes al mismo tiempo.

Tipos de cadena disponibles:
l1: Mainnet de Ethereum y testnets.

optimism: OP Mainnet y OP Sepolia.

generic: para otras cadenas.

Ejemplo de uso de red OP:

ts
Copiar
Editar
import { network } from "hardhat";

const chainType = "optimism";
const { viem } = await network.connect("hardhatOp", chainType);

console.log("Enviando transacción usando OP");

const publicClient = await viem.getPublicClient();
const [senderClient] = await viem.getWalletClients();

console.log("Enviando 1 wei de", senderClient.account.address, "a sí mismo");