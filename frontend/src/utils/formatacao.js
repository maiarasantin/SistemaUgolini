// Esse arquivo  tem o objetivo de criar funções de formatação usadas só para MOSTRAR dados na tela de vendedores

//Usada pelas próximas funções só para limpar os dados antes de estilizar eles
export function somenteNumeros(texto) {
  if (!texto) return "";
  return String(texto).replace(/\D/g, "");
}




export function formatarCpf(cpf) {
  const numeros = somenteNumeros(cpf);

  if (numeros.length !== 11) return cpf || "";
  return (
    numeros.slice(0, 3) + "." +
    numeros.slice(3, 6) + "." +
    numeros.slice(6, 9) + "-" +
    numeros.slice(9)
  );
}


// Formata o CNPJ para que fique bonito no front
export function formatarCnpj(valor) {
  
  const numeros = somenteNumeros(valor).slice(0, 14);

  
  return numeros
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}



export function formatarDocumento(valor) {
  const numeros = somenteNumeros(valor);

  // Se for 11 dígitos é CPF
  if (numeros.length === 11) {
    return formatarCpf(numeros);
  }

  // Se for  14 dígitos é CNPJ
  if (numeros.length === 14) {
    return formatarCnpj(numeros);
  }

  return valor || "";
}




export function formatarTelefone(telefone) {
  const numeros = somenteNumeros(telefone);
  if (numeros.length === 11) {  // Telefone com 11 números: 49999998888 vira (49) 99999-8888
    return "(" + numeros.slice(0, 2) + ") " + numeros.slice(2, 7) + "-" + numeros.slice(7);  
  }
  if (numeros.length === 10) {  // Telefone com 10 números: 4933334444 vira (49) 3333-4444
    return "(" + numeros.slice(0, 2) + ") " + numeros.slice(2, 6) + "-" + numeros.slice(6);
  }
  // Se for outro tamanho mostra como veio
  return telefone || "";
}

// Troca a ordem da data
export function formatarData(data) {
  if (!data) return "";
  
  const partes = String(data).slice(0, 10).split("-");
  if (partes.length !== 3) return data;
  const [ano, mes, dia] = partes;
  return dia + "/" + mes + "/" + ano;
}