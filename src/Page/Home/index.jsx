import api from "../../Services/Api";
import { useState, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiFolder } from "react-icons/fi";

export default function Home() {
    const [inputCnpj, setInputCnpj] = useState('')
    const [DadosApi, setDadosApi] = useState([])
    const inputRef = useRef(null)
    async function PesquisarCNPJ() {
        const CNPJ = inputCnpj.replace(/\D/g, "");

        try {
            const response = await api.get(`cnpj/${CNPJ}`, {
                params: {
                    apy_key: 'ak_cfb99603e00ffbb2c6e5a8ef21c04e97dd8ca96c83cb4eadef1cf9caf99b21e4',
                }
            })
            setDadosApi([response.data.data]);
            toast.success("CNPJ Localizado com sucesso!");

        } catch (error) {
            toast.error("Não foi possível consultar o CNPJ Verifique se está correto.");
        }

    }



    function getTempoEmpresa(dataAbertura) {
        const inicio = new Date(dataAbertura);
        const hoje = new Date();

        let anos = hoje.getFullYear() - inicio.getFullYear();

        const aniversarioEsteAno = new Date(hoje.getFullYear(), inicio.getMonth(), inicio.getDate());
        if (hoje < aniversarioEsteAno) {
            anos -= 1;
        }

        if (anos < 1) {
            return "Ainda não completou o primeiro ano de empresa";
        } else if (anos === 1) {
            return "1 ano";
        } else {
            return `${anos} anos`;
        }
    }



    function LimparDados() {
        setDadosApi([]);
        setInputCnpj([]);
        inputRef.current.focus();

        toast.success('Dados removido com sucesso !')
    }

    return (
        <div className="flex justify-center items-center flex-col">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="flex flex-col  max-w-[90%] ">
                <div className="flex flex-col gap-1  mt-10 lg:mt-15 max-w-[97%]">
                    <h1 className="font-bold text-2xl lg:text-4xl text-gray-800">Consulta de Situação Cadastral</h1>
                    <p className="text-gray-500 ">Verificação rápida para decisão de abertura de cadastro</p>
                </div>

                <div className="flex justify-center items-center mt-8 gap-3 max-w-[95%]">
                    <input value={inputCnpj} type="text" ref={inputRef} placeholder="00.000.000/0000-00" className="w-130 outline-none bg-gray-100 p-3 rounded-xl shadow" onChange={((event) => setInputCnpj(event.target.value))} onKeyDown={(event) => { if (event.key === "Enter") { PesquisarCNPJ() } }} />
                    <button onClick={PesquisarCNPJ} className="cursor-pointer shadow hover:bg-blue-500 bg-blue-400 p-3 rounded-xl text-gray-50">Consultar</button>
                </div>

            </div>

            <div>
                <div className="flex flex-col justify-center items-center">
                    {DadosApi.length === 0 ? (
                        <div className="flex py-10 flex-col justify-center items-center gap-5 text-gray-400 ">
                            <FiFolder className="text-6xl" />
                            <p>Nenhum resultado encontrado !</p>
                        </div>
                    ) : (
                        DadosApi.map((item) => (
                            <div key={item.cnpj} className="flex flex-col justify-center items-center mt-7 lg:mt-10">
                                <div className=" flex gap-5 lg:gap-10 items-start flex-col lg:flex-row p-2 max-w-300 w-[95%] text-lg">
                                    <div className="flex-1">
                                        <div className="flex flex-col lg:flex-row gap-4 mb-5 font-bold text-lg items-start">
                                            <p className={`${item.descricao_situacao_cadastral === "ATIVA" ? "text-green-600" : "text-red-600"} whitespace-nowrap`}>
                                                Situação Cadastral: {item.descricao_situacao_cadastral}
                                            </p>
                                            <p className="whitespace-nowrap">
                                                Início de Atividades: {item.data_inicio_atividade?.split("-").reverse().join("/")}
                                            </p>
                                        </div>

                                        <p key={item.cnpj}><strong>Razão Social:</strong> {item.razao_social}</p>
                                        <p><strong>Fantasia:</strong> {item.nome_fantasia}</p>
                                        <p><strong>CNPJ:</strong> {item.cnpj}</p>

                                        <div className="flex gap-2">
                                            <p><strong>Endereço:</strong> {item.logradouro}</p>
                                            <p><strong>N°</strong> {item.numero}</p>
                                        </div>
                                        <p><strong>Bairro:</strong> {item.bairro}</p>
                                        <p><strong>CEP:</strong> {item.cep}</p>
                                        <div className="flex gap-2">
                                            <p><strong>Município:</strong> {item.municipio}</p>
                                            <p>{item.uf}</p>
                                        </div>

                                    </div>

                                    <div className="flex-1">
                                        <p><strong>Natureza Juridica:</strong> {item.natureza_juridica}</p>
                                        <p><strong>Descrição:</strong> {item.cnae_fiscal_descricao}</p>
                                        <p><strong>Porte:</strong> {item.porte}</p>
                                        <p className="mt-2"><strong>Capital Social:</strong> {Number(item.capital_social).toLocaleString("pt-BR", { style: "currency", currency: "BRL", })}</p>
                                        <p><strong>Filial:</strong> {item.descricao_identificador_matriz_filial}</p>
                                        <p><strong>Unidade:</strong> {item.identificador_matriz_filial}</p>



                                    </div>
                                </div>

                                <div className=" max-w-300 w-[95%] p-2 mt-3 mb-5 ">
                                    <p className={`${item.descricao_situacao_cadastral === "ATIVA" ? "text-blue-600" : "text-red-600"} font-bold text-xl`}>
                                        {item.descricao_situacao_cadastral === "ATIVA" ? `Empresa em atividade à ${getTempoEmpresa(item.data_inicio_atividade)}` : "Empresa não está em atividade"}
                                    </p>
                                </div>

                                <button onClick={LimparDados} className=" mb-15 cursor-pointer shadow hover:bg-blue-500 bg-blue-400 p-3 rounded-xl  max-w-300 w-[95%] text-gray-50">Limpar resultados</button>

                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}