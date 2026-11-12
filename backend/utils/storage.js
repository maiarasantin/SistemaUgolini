// Envia e apaga arquivos no Supabase Storage (o "disco" do Supabase).
// O banco guarda só o endereço (URL) do arquivo; o arquivo em si fica aqui.
const { createClient } = require("@supabase/supabase-js");

let cliente = null; // criado só na primeira vez que for usado

function nomeDoBucket() {
    return process.env.SUPABASE_BUCKET || "pedidos";
}

function obterCliente() {
    if (!cliente) {
        const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
        if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
            throw new Error("Defina SUPABASE_URL e SUPABASE_SECRET_KEY no .env.");
        }
        // Essa chave ignora todas as regras de acesso: use só no backend.
        cliente = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
            auth: { persistSession: false },
        });
    }
    return cliente;
}

// enviarArquivo: guarda o arquivo no bucket e devolve a URL pública dele.
async function enviarArquivo(caminho, buffer, contentType) {
    const supabase = obterCliente();
    const { error } = await supabase.storage
        .from(nomeDoBucket())
        .upload(caminho, buffer, { contentType, upsert: false });

    if (error) {
        throw new Error(`Falha ao enviar arquivo ao Storage: ${error.message}`);
    }

    const { data } = supabase.storage.from(nomeDoBucket()).getPublicUrl(caminho);
    return data.publicUrl;
}

// removerArquivo: apaga um arquivo do bucket pelo caminho (ex.: "pedidos/12-abc.jpg").
async function removerArquivo(caminho) {
    const { error } = await obterCliente().storage.from(nomeDoBucket()).remove([caminho]);
    if (error) {
        throw new Error(`Falha ao remover arquivo do Storage: ${error.message}`);
    }
}

// extrairCaminho: descobre o caminho do arquivo a partir da URL guardada no banco.
// Devolve null se a URL não for de um arquivo deste bucket.
function extrairCaminho(url) {
    const marcador = `/${nomeDoBucket()}/`;
    const posicao = String(url).indexOf(marcador);
    if (posicao === -1) return null;
    return decodeURIComponent(String(url).slice(posicao + marcador.length).split("?")[0]);
}

module.exports = { enviarArquivo, removerArquivo, extrairCaminho };