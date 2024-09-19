import { DataProps } from '../controllers/CreateNutritionController'
import { GoogleGenerativeAI } from '@google/generative-ai'

class CreateNutritionService {
    async execute({ name, age, gender, height, level, objective, weight }: DataProps) {
        try {
            // Inicializando a API com a chave de API
            const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
            
            // Obtendo o modelo gemini-1.5-flash
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // Gerando conteúdo com o modelo
            const prompt = `Crie uma dieta completa para uma pessoa com nome: ${name} do sexo ${gender} com peso atual: ${weight}kg, altura: ${height}, idade: ${age} anos e com foco e objetivo em ${objective}, atualmente nível de atividade: ${level} e ignore qualquer outro parâmetro que não seja os passados. Retorne em JSON com as respectivas propriedades: 
            - propriedade nome: o nome da pessoa, 
            - propriedade sexo: o sexo, 
            - propriedade idade: a idade, 
            - propriedade altura: a altura, 
            - propriedade peso: o peso, 
            - propriedade objetivo: o objetivo atual, 
            - propriedade refeições: um array contendo objetos representando cada refeição, 
            - cada refeição deve conter a propriedade horário (horário da refeição), 
            - propriedade nome (nome da refeição) 
            - propriedade alimentos (array contendo os alimentos dessa refeição). 
            Pode incluir uma propriedade suplementos contendo array com sugestão de suplemento adequado para o sexo e objetivo da pessoa. 
            Não inclua observações além das mencionadas e retorne em formato JSON sem acentuação.`;

            const response = await model.generateContent(prompt);

            // Exibindo a resposta da API para depuração
            console.log(JSON.stringify(response, null, 2));

            // Verificando se há candidatos na resposta e tratando a saída
            if (response.response && response.response.candidates) {
                const jsonText = response.response.candidates[0]?.content.parts[0].text as string;

                // Removendo marcas de código e formatando o JSON
                let jsonString = jsonText.replace(/```\w*\n/g, '').replace(/\n```/g, '').trim();

                // Convertendo para objeto JSON
                let jsonObject = JSON.parse(jsonString);

                return { data: jsonObject }; // Retorna o objeto JSON completo
            }

        } catch (err) {
            console.error("Erro JSON: ", err);
            throw new Error("Failed to create diet.");
        }
    }
}

export { CreateNutritionService };
