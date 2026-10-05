require('dotenv').config();
const {createClient} = require('@supabase/supabase-js');

// Variáveis de ambiente do arquivo .env
const supabaseURL = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Alerta visual
if (!supabaseURL || !supabaseKey || supabaseURL.includes('seu-projeto')) {
    console.log('\n Atenção: não configurado .env');
    console.log('Abra o arquivo backend/ .env \n');
}
const supabase = createClient(supabaseURL || '', supabaseKey || '');
module.exports = supabase;