const express = require('express');
const cors = require('cors');
const supabase = require('./supabase') //importa a conexão om supabase
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware essenciais
app.use(cors()); //Permite que o frontend acesse o backend
app.use(express.json()); //Permite que o Express entenda as requisições com o corpo em JSON

//Passo 1 memória RAM do servidor
let produtosEmMemoria = [
    {id:1,nome: 'Teclado Mecânico RGB', preco: 150.00},
    {id: 2, nome: 'Mouse Gamer 3200', preco: 85.50}
];

// Rota GET
app.get('/produtos', async (req, res) =>{
    //console.log('[GET / produtos] Enviando produtos em memória...'),
    //res.json(produtosEmMemoria);
    const {data, error} = await supabase.from('produtos').select('*').order('id', {ascending: true});
    if (error) {
        return res.status(500).json({error: error.message})
    }
    res.json(data);
});

// Rota POST
app.post('/produtos', (req, res)=> {
    const {nome, preco} = req.body;

    if (!nome || !preco){
        return res.status(400).json({erro:'Nome e preço são obrigatórios!'});
    };

    const novoProduto = {
        id: Date.now(), //Gera um ID temporário baseado no timestamp
        nome,
        preco: parseFloat(preco)
    };

    produtosEmMemoria.push(novoProduto);
    console.log(`[POST / produtos] Produtos adicionados na RAM: ${novoProduto.nome}`);

    res.status(201).json(novoProduto);
})

// Rota PUT
app.put('/produtos/:id', (req, res) =>{
    const {id} = req.params;
    const {nome, preco} = req.body;
    const index = produtosEmMemoria.findIndex(p => p.id === parseInt(id));

    if (!index) {
        return res.status(404).json({
            erro:`Produto com ID ${id} não foi encontrado para atualização`
        });
    }

    produtosEmMemoria[index] = {
        ...produtosEmMemoria[index],
        nome: nome || produtosEmMemoria[index].nome,
        preco: preco != undefined ?  parseFloat(preco) : produtosEmMemoria[index].preco
    };

    return res.status(200).json({
        mensagem: 'Produto atualizado com sucesso!',
        produtosEmMemoria: produtosEmMemoria[index]
    });
});

// Rota DELETE
app.delete('/produtos/:id', (req, res) => {
    const {id} = req.params;
    const index = produtosEmMemoria.findIndex(p => p.id === parseInt(id));

    if (!index) {
        return res.status(404).json({
            erro:`Produto com ID ${id} não foi encontrado para exclusão`
        });
    }

    produtosEmMemoria.splice(index, 1);

    return res.status(200).json({
        mensagem: `Produto com ID ${id} removido com sucesso!`
    });
});

// listen
app.listen(PORT, () =>{
    console.log('==============================================================');
    console.log(`Servidor Back-End rodando na nuvem`); //http://localhost:${PORT}
});