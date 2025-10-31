import { useState, useMemo } from "react";
import { FileUpload } from "@/components/FileUpload";
import { UpdateFileUpload } from "@/components/UpdateFileUpload";
import { StatsCard } from "@/components/StatsCard";
import { IrregularityTable } from "@/components/IrregularityTable";
import { VerificacaoJVMTable } from "@/components/VerificacaoJVMTable";
import { Filters } from "@/components/Filters";
import { FluxoChart } from "@/components/FluxoChart";
import { AnalysisDashboard } from "@/components/AnalysisDashboard";
import type { Irregularity } from "@shared/schema";
import { AlertCircle, CheckCircle, Clock, FileText, Download, AlertTriangle, MapPin, BookOpen, Save, Info, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import * as XLSX from "xlsx";

const Index = () => {
  const { toast } = useToast();
  const [data, setData] = useState<Irregularity[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("registros");
  const [logradouroSearch, setLogradouroSearch] = useState("");
  const [selectedIrregularidade, setSelectedIrregularidade] = useState("all");

  const handleFileUpload = (newData: Irregularity[], newChartData: any[]) => {
    setData(newData);
    setChartData(newChartData);
  };

  const handleFileUpdate = (newData: Irregularity[], newChartData: any[]) => {
    setData(newData);
    setChartData(newChartData);
  };

  const handleExportCompleteExcel = () => {
    if (data.length === 0) {
      toast({
        title: "Nenhum dado disponível",
        description: "Não há dados para exportar.",
        variant: "destructive",
      });
      return;
    }

    // Preparar dados dos registros
    const excelData = data.map(item => ({
      "Município": item.municipio,
      "Nº Formulário": item.numFormulario,
      "Número do Poste": item.numeroPoste,
      "Operadora": item.operadora,
      "Irregularidade": item.irregularidade,
      "Vencidas": item.vencidas,
      "No Prazo": item.noPrazo,
      "Email Enviado": item.emailEnviado,
      "Data Envio Email": item.dataEnvioEmail,
      "Regularizado": item.regularizado,
      "Status Verificação": item.statusVerificacao,
      "Bairro": item.bairro,
      "Logradouro": item.logradouro,
      "Nº Logradouro": item.numLogradouro,
    }));

    // Criar workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Ajustar largura das colunas
    const colWidths = [
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 },
      { wch: 30 }, { wch: 10 }, { wch: 10 }, { wch: 15 },
      { wch: 18 }, { wch: 12 }, { wch: 12 }, { wch: 20 }, { wch: 30 }, { wch: 15 },
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Registros");

    // Adicionar planilha de gráfico se houver dados
    if (chartData.length > 0) {
      const chartWs = XLSX.utils.json_to_sheet(chartData);
      XLSX.utils.book_append_sheet(wb, chartWs, "Gráfico");
    }

    // Exportar arquivo
    XLSX.writeFile(wb, `irregularidades_completo_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast({
      title: "Arquivo exportado!",
      description: `${data.length} registros exportados com sucesso.`,
    });
  };

  const handleExportRegularizadosExcel = () => {
    const regularizados = data.filter(item => item.regularizado === "Sim");
    
    if (regularizados.length === 0) {
      toast({
        title: "Nenhum registro regularizado",
        description: "Não há dados regularizados para exportar.",
        variant: "destructive",
      });
      return;
    }

    // Preparar dados para o Excel
    const excelData = regularizados.map(item => ({
      "Município": item.municipio,
      "Nº Formulário": item.numFormulario,
      "Número do Poste": item.numeroPoste,
      "Operadora": item.operadora,
      "Irregularidade": item.irregularidade,
      "Vencidas": item.vencidas,
      "No Prazo": item.noPrazo,
      "Email Enviado": item.emailEnviado,
      "Data Envio Email": item.dataEnvioEmail,
      "Regularizado": item.regularizado,
      "Status Verificação": item.statusVerificacao,
      "Bairro": item.bairro,
      "Logradouro": item.logradouro,
      "Nº Logradouro": item.numLogradouro,
    }));

    // Criar workbook e worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Ajustar largura das colunas
    const colWidths = [
      { wch: 15 }, // Município
      { wch: 15 }, // Nº Formulário
      { wch: 15 }, // Número do Poste
      { wch: 20 }, // Operadora
      { wch: 30 }, // Irregularidade
      { wch: 10 }, // Vencidas
      { wch: 10 }, // No Prazo
      { wch: 15 }, // Email Enviado
      { wch: 18 }, // Data Envio Email
      { wch: 12 }, // Regularizado
      { wch: 12 }, // Reincidente
      { wch: 20 }, // Bairro
      { wch: 30 }, // Logradouro
      { wch: 15 }, // Nº Logradouro
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Regularizados");

    // Exportar arquivo
    XLSX.writeFile(wb, `regularizados_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast({
      title: "Arquivo exportado!",
      description: `${regularizados.length} registros regularizados exportados.`,
    });
  };

  const handleExportAguardandoJVMExcel = () => {
    const aguardandoJVM = data.filter(item => item.statusVerificacao === "aguardando_verificacao_jvm");
    
    if (aguardandoJVM.length === 0) {
      toast({
        title: "Nenhum registro aguardando JVM",
        description: "Não há dados aguardando verificação para exportar.",
        variant: "destructive",
      });
      return;
    }

    // Preparar dados para o Excel
    const excelData = aguardandoJVM.map(item => ({
      "Município": item.municipio,
      "Nº Formulário": item.numFormulario,
      "Número do Poste": item.numeroPoste,
      "Operadora": item.operadora,
      "Irregularidade": item.irregularidade,
      "Vencidas": item.vencidas,
      "No Prazo": item.noPrazo,
      "Email Enviado": item.emailEnviado,
      "Data Envio Email": item.dataEnvioEmail,
      "Regularizado": item.regularizado,
      "Status Verificação": item.statusVerificacao,
      "Bairro": item.bairro,
      "Logradouro": item.logradouro,
      "Nº Logradouro": item.numLogradouro,
    }));

    // Criar workbook e worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Ajustar largura das colunas
    const colWidths = [
      { wch: 15 }, // Município
      { wch: 15 }, // Nº Formulário
      { wch: 15 }, // Número do Poste
      { wch: 20 }, // Operadora
      { wch: 30 }, // Irregularidade
      { wch: 10 }, // Vencidas
      { wch: 10 }, // No Prazo
      { wch: 15 }, // Email Enviado
      { wch: 18 }, // Data Envio Email
      { wch: 12 }, // Regularizado
      { wch: 20 }, // Status Verificação
      { wch: 20 }, // Bairro
      { wch: 30 }, // Logradouro
      { wch: 15 }, // Nº Logradouro
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Aguardando JVM");

    // Exportar arquivo
    XLSX.writeFile(wb, `aguardando_jvm_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast({
      title: "Arquivo exportado!",
      description: `${aguardandoJVM.length} registros aguardando JVM exportados.`,
    });
  };

  const handleExportJSON = () => {
    const exportData = {
      registros: data,
      chartData: chartData,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `irregularidades_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Arquivo exportado!",
      description: "Os dados foram salvos em formato JSON.",
    });
  };

  const handleUpdateRegularizado = (numFormulario: string, numeroPoste: string, regularizado: boolean) => {
    setData(prevData =>
      prevData.map(item =>
        item.numFormulario === numFormulario && item.numeroPoste === numeroPoste
          ? { 
              ...item, 
              regularizado: regularizado ? "Sim" : "Não",
              emCampo: regularizado ? "Não" : item.emCampo,
              dataEnvioEmail: regularizado ? format(new Date(), "dd/MM/yyyy HH:mm") : item.dataEnvioEmail
            }
          : item
      )
    );
  };

  const handleUpdateEmCampo = (numFormulario: string, numeroPoste: string, emCampo: boolean) => {
    setData(prevData =>
      prevData.map(item =>
        item.numFormulario === numFormulario && item.numeroPoste === numeroPoste
          ? { ...item, emCampo: emCampo ? "Sim" : "Não" }
          : item
      )
    );
  };

  const handleConfirmarVerificacaoJVM = (numFormulario: string, numeroPoste: string) => {
    setData(prevData =>
      prevData.map(item =>
        item.numFormulario === numFormulario && item.numeroPoste === numeroPoste
          ? { ...item, statusVerificacao: "normal" as const }
          : item
      )
    );
    
    toast({
      title: "Registro confirmado",
      description: `O registro ${numFormulario} - Poste ${numeroPoste} foi movido para irregularidades ativas.`,
    });
  };

  const municipios = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.municipio))).sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Filtrar apenas registros normais (não aguardando verificação)
      if (item.statusVerificacao === "aguardando_verificacao_jvm") return false;

      const matchesSearch =
        item.numFormulario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.numeroPoste.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.logradouro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.irregularidade.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesMunicipio =
        selectedMunicipio === "all" || item.municipio === selectedMunicipio;

      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "vencido" && item.vencidas < 0 && item.regularizado === "Não") ||
        (selectedStatus === "prazo" && item.vencidas >= 0 && item.regularizado === "Não") ||
        (selectedStatus === "regularizado" && item.regularizado === "Sim");

      const matchesLogradouro = !logradouroSearch.trim() || 
        item.logradouro.toLowerCase().includes(logradouroSearch.toLowerCase());

      const matchesIrregularidade = selectedIrregularidade === "all" || 
        item.irregularidade === selectedIrregularidade;

      return matchesSearch && matchesMunicipio && matchesStatus && matchesLogradouro && matchesIrregularidade;
    });
  }, [data, searchTerm, selectedMunicipio, selectedStatus, logradouroSearch, selectedIrregularidade]);

  const aguardandoVerificacaoData = useMemo(() => {
    return data.filter((item) => item.statusVerificacao === "aguardando_verificacao_jvm");
  }, [data]);

  const emCampoData = useMemo(() => {
    return data.filter((item) => item.emCampo === "Sim" && item.statusVerificacao === "normal");
  }, [data]);

  // Stats principais - sempre mostram o total geral
  const stats = useMemo(() => {
    // Contar apenas registros normais (não aguardando verificação)
    const normalData = data.filter((item) => item.statusVerificacao === "normal");
    const total = normalData.length;
    const vencidas = normalData.filter((item) => item.vencidas < 0 && item.regularizado === "Não").length;
    const noPrazo = normalData.filter((item) => item.vencidas >= 0 && item.regularizado === "Não").length;
    const regularizadas = normalData.filter((item) => item.regularizado === "Sim").length;
    const aguardandoVerificacao = data.filter((item) => item.statusVerificacao === "aguardando_verificacao_jvm").length;
    const emCampo = normalData.filter((item) => item.emCampo === "Sim").length;

    return { total, vencidas, noPrazo, regularizadas, aguardandoVerificacao, emCampo };
  }, [data]);

  // Stats do município filtrado - apenas quando há filtro selecionado
  const municipioStats = useMemo(() => {
    if (selectedMunicipio === "all") return null;

    let filteredByMunicipio = data.filter((item) => item.municipio === selectedMunicipio);
    
    // Filtrar por logradouro se houver busca
    if (logradouroSearch.trim()) {
      filteredByMunicipio = filteredByMunicipio.filter((item) => 
        item.logradouro.toLowerCase().includes(logradouroSearch.toLowerCase())
      );
    }
    
    const normalData = filteredByMunicipio.filter((item) => item.statusVerificacao === "normal");
    const total = normalData.length;
    const vencidas = normalData.filter((item) => item.vencidas < 0 && item.regularizado === "Não").length;
    const noPrazo = normalData.filter((item) => item.vencidas >= 0 && item.regularizado === "Não").length;
    const regularizadas = normalData.filter((item) => item.regularizado === "Sim").length;
    const aguardandoVerificacao = filteredByMunicipio.filter((item) => item.statusVerificacao === "aguardando_verificacao_jvm").length;
    const emCampo = normalData.filter((item) => item.emCampo === "Sim").length;

    return { total, vencidas, noPrazo, regularizadas, aguardandoVerificacao, emCampo };
  }, [data, selectedMunicipio, logradouroSearch]);

  // Preparar dados do gráfico
  const fluxoData = useMemo(() => {
    if (chartData.length === 0) return [];
    
    const semanas = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];
    return semanas.map((semana, idx) => ({
      semana,
      agosto: chartData[0]?.[`semana${idx + 1}`] || null,
      setembro: chartData[1]?.[`semana${idx + 1}`] || null,
      outubro: chartData[2]?.[`semana${idx + 1}`] || null,
    }));
  }, [chartData]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Sistema de Gestão de Irregularidades
            </h1>
            <p className="text-muted-foreground text-lg">
              Gerencie e organize irregularidades de telecomunicações em postes
            </p>
          </div>
          {data.length > 0 && (
            <Button onClick={handleExportJSON} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar JSON
            </Button>
          )}
        </div>

        {/* Upload Section */}
        {data.length === 0 ? (
          <FileUpload onFileUpload={handleFileUpload} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UpdateFileUpload onFileUpdate={handleFileUpdate} currentData={data} />
            <Card className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Exportar arquivo completo</h3>
                <p className="text-sm text-muted-foreground">
                  Baixar todos os dados atualizados em Excel
                </p>
              </div>
              <Button onClick={handleExportCompleteExcel} className="gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            </Card>
          </div>
        )}

        {/* Conteúdo Condicional */}
        {data.length === 0 ? (
          <Card className="p-16">
            <div className="text-center text-muted-foreground space-y-4">
              <FileText className="w-16 h-16 mx-auto opacity-50" />
              <div>
                <p className="text-xl font-medium">Nenhum arquivo importado</p>
                <p className="text-sm mt-2">Faça upload de um arquivo Excel para começar</p>
              </div>
            </div>
          </Card>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <StatsCard
                title="Total de Irregularidades"
                value={stats.total}
                icon={FileText}
                variant="default"
                onClick={() => {
                  setSelectedStatus("all");
                  setActiveTab("registros");
                }}
                data-testid="card-total"
              />
              <StatsCard
                title="Vencidas"
                value={stats.vencidas}
                icon={AlertCircle}
                variant="destructive"
                description="Requerem atenção imediata"
                onClick={() => {
                  setSelectedStatus("vencido");
                  setActiveTab("registros");
                }}
                data-testid="card-vencidas"
              />
              <StatsCard
                title="No Prazo"
                value={stats.noPrazo}
                icon={Clock}
                variant="warning"
                onClick={() => {
                  setSelectedStatus("prazo");
                  setActiveTab("registros");
                }}
                data-testid="card-no-prazo"
              />
              <StatsCard
                title="Regularizadas"
                value={stats.regularizadas}
                icon={CheckCircle}
                variant="success"
                onClick={() => {
                  setSelectedStatus("regularizado");
                  setActiveTab("registros");
                }}
                data-testid="card-regularizadas"
              />
              <StatsCard
                title="Em Campo"
                value={stats.emCampo}
                icon={MapPin}
                variant="info"
                description="Verificação presencial"
                onClick={() => setActiveTab("em-campo")}
                data-testid="card-em-campo"
              />
              <StatsCard
                title="Aguardando JVM"
                value={stats.aguardandoVerificacao}
                icon={AlertTriangle}
                variant="info"
                description="Reincidências para verificar"
                onClick={() => setActiveTab("verificacao-jvm")}
                data-testid="card-aguardando-jvm"
              />
            </div>

            {/* Filters */}
            <Filters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedMunicipio={selectedMunicipio}
              onMunicipioChange={setSelectedMunicipio}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              municipios={municipios}
              logradouroSearch={logradouroSearch}
              onLogradouroSearchChange={setLogradouroSearch}
              selectedIrregularidade={selectedIrregularidade}
              onIrregularidadeChange={setSelectedIrregularidade}
              data={data}
            />

            {/* Estatísticas do Município Selecionado */}
            {selectedMunicipio !== "all" && municipioStats && (
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">
                      Estatísticas de {selectedMunicipio}
                    </h3>
                  </div>
                  
                  <div className="max-w-md">
                    <Input
                      placeholder="Buscar por logradouro..."
                      value={logradouroSearch}
                      onChange={(e) => setLogradouroSearch(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mt-4">
                  <StatsCard
                    title="Total"
                    value={municipioStats.total}
                    icon={FileText}
                    variant="default"
                    onClick={() => {
                      setSelectedStatus("all");
                      setActiveTab("registros");
                    }}
                    data-testid="card-municipio-total"
                  />
                  <StatsCard
                    title="Vencidas"
                    value={municipioStats.vencidas}
                    icon={AlertCircle}
                    variant="destructive"
                    onClick={() => {
                      setSelectedStatus("vencido");
                      setActiveTab("registros");
                    }}
                    data-testid="card-municipio-vencidas"
                  />
                  <StatsCard
                    title="No Prazo"
                    value={municipioStats.noPrazo}
                    icon={Clock}
                    variant="warning"
                    onClick={() => {
                      setSelectedStatus("prazo");
                      setActiveTab("registros");
                    }}
                    data-testid="card-municipio-no-prazo"
                  />
                  <StatsCard
                    title="Regularizadas"
                    value={municipioStats.regularizadas}
                    icon={CheckCircle}
                    variant="success"
                    onClick={() => {
                      setSelectedStatus("regularizado");
                      setActiveTab("registros");
                    }}
                    data-testid="card-municipio-regularizadas"
                  />
                  <StatsCard
                    title="Em Campo"
                    value={municipioStats.emCampo}
                    icon={MapPin}
                    variant="info"
                    onClick={() => setActiveTab("em-campo")}
                    data-testid="card-municipio-em-campo"
                  />
                  <StatsCard
                    title="Aguardando JVM"
                    value={municipioStats.aguardandoVerificacao}
                    icon={AlertTriangle}
                    variant="info"
                    onClick={() => setActiveTab("verificacao-jvm")}
                    data-testid="card-municipio-aguardando-jvm"
                  />
                </div>
              </Card>
            )}

            {/* Tabs para Instruções, Registros, Verificação JVM, Em Campo, Análises e Gráfico */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full max-w-6xl grid-cols-6">
                <TabsTrigger value="instrucoes" data-testid="tab-instrucoes">Instruções</TabsTrigger>
                <TabsTrigger value="registros" data-testid="tab-registros">
                  Irregularidades ({filteredData.length})
                </TabsTrigger>
                <TabsTrigger value="verificacao-jvm" data-testid="tab-verificacao-jvm">
                  Aguardando JVM ({stats.aguardandoVerificacao})
                </TabsTrigger>
                <TabsTrigger value="em-campo" data-testid="tab-em-campo">
                  Em Campo ({stats.emCampo})
                </TabsTrigger>
                <TabsTrigger value="analises" data-testid="tab-analises">Análises</TabsTrigger>
                <TabsTrigger value="grafico" data-testid="tab-grafico">Gráfico de Fluxo</TabsTrigger>
              </TabsList>
              
              <TabsContent value="instrucoes" className="space-y-4">
                <Card className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                        Como Usar o Sistema
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Guia completo para gerenciar irregularidades de telecomunicações
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Card className="p-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Info className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-green-900 dark:text-green-100 mb-3">
                            ⭐ Sistema 100% Gratuito
                          </h3>
                          <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                            Este sistema funciona <strong>totalmente offline e gratuitamente</strong>. Todas as informações são processadas e armazenadas localmente no seu navegador. Não há necessidade de cadastro, login ou pagamento.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                          <Save className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-orange-900 dark:text-orange-100 mb-3">
                            ⚠️ IMPORTANTE: Salve Suas Alterações!
                          </h3>
                          <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                            <strong>O sistema utiliza armazenamento local em JSON.</strong> Isso significa que:
                          </p>
                          <ul className="list-disc list-inside space-y-2 text-sm text-orange-800 dark:text-orange-200 ml-4">
                            <li><strong>Sempre exporte seus dados</strong> após fazer alterações usando o botão "Exportar Excel Completo"</li>
                            <li>Para continuar trabalhando, <strong>importe o arquivo JSON/Excel exportado</strong> na próxima sessão</li>
                            <li>Suas edições <strong>não ficam salvas automaticamente</strong> - você precisa exportar manualmente</li>
                            <li>Se limpar os dados do navegador ou trocar de dispositivo, seus dados serão perdidos se não foram exportados</li>
                          </ul>
                        </div>
                      </div>
                    </Card>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Passo a Passo de Uso
                      </h3>
                      
                      <div className="grid gap-4">
                        <Card className="p-4 border-l-4 border-l-blue-500">
                          <h4 className="font-semibold mb-2">1. Importar Dados</h4>
                          <p className="text-sm text-muted-foreground">
                            Clique em "Upload de Arquivo" e selecione um arquivo Excel (.xlsx) ou JSON (.json) contendo os dados das irregularidades. O sistema processará automaticamente as informações.
                          </p>
                        </Card>

                        <Card className="p-4 border-l-4 border-l-green-500">
                          <h4 className="font-semibold mb-2">2. Visualizar e Filtrar</h4>
                          <p className="text-sm text-muted-foreground">
                            Use os filtros disponíveis para visualizar irregularidades por município, status, operadora ou tipo de irregularidade. Clique nos cards de estatísticas para filtros rápidos.
                          </p>
                        </Card>

                        <Card className="p-4 border-l-4 border-l-purple-500">
                          <h4 className="font-semibold mb-2">3. Editar Informações</h4>
                          <p className="text-sm text-muted-foreground">
                            Nas tabelas de cada aba, você pode marcar irregularidades como regularizadas, enviar para verificação JVM ou marcar como "Em Campo". Faça as alterações necessárias.
                          </p>
                        </Card>

                        <Card className="p-4 border-l-4 border-l-orange-500">
                          <h4 className="font-semibold mb-2">4. ⚠️ SALVAR - Exportar Dados</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>ESSENCIAL:</strong> Após qualquer alteração, clique em "Exportar Excel Completo" para salvar seus dados. Este arquivo conterá todas as suas edições.
                          </p>
                          <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                            💾 Dica: Salve o arquivo exportado com a data no nome, ex: "irregularidades_2025-10-31.xlsx"
                          </p>
                        </Card>

                        <Card className="p-4 border-l-4 border-l-red-500">
                          <h4 className="font-semibold mb-2">5. Continuar Trabalhando</h4>
                          <p className="text-sm text-muted-foreground">
                            Para retomar o trabalho em outra sessão, use o botão "Atualizar Arquivo" e importe o arquivo que você exportou anteriormente. Todas as suas edições estarão lá!
                          </p>
                        </Card>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <h3 className="text-xl font-semibold">Recursos Disponíveis</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4">
                          <h4 className="font-semibold mb-2">📊 Irregularidades</h4>
                          <p className="text-sm text-muted-foreground">
                            Visualize todas as irregularidades ativas, marque como regularizadas ou envie para verificação.
                          </p>
                        </Card>
                        <Card className="p-4">
                          <h4 className="font-semibold mb-2">🔍 Aguardando JVM</h4>
                          <p className="text-sm text-muted-foreground">
                            Registros que precisam de verificação pela equipe JVM antes de prosseguir.
                          </p>
                        </Card>
                        <Card className="p-4">
                          <h4 className="font-semibold mb-2">📍 Em Campo</h4>
                          <p className="text-sm text-muted-foreground">
                            Irregularidades que estão sendo verificadas presencialmente pela equipe.
                          </p>
                        </Card>
                        <Card className="p-4">
                          <h4 className="font-semibold mb-2">📈 Análises</h4>
                          <p className="text-sm text-muted-foreground">
                            Dashboard com insights e análises detalhadas dos dados importados.
                          </p>
                        </Card>
                        <Card className="p-4">
                          <h4 className="font-semibold mb-2">📉 Gráfico de Fluxo</h4>
                          <p className="text-sm text-muted-foreground">
                            Visualização temporal do fluxo de irregularidades ao longo das semanas.
                          </p>
                        </Card>
                        <Card className="p-4">
                          <h4 className="font-semibold mb-2">💾 Exportação</h4>
                          <p className="text-sm text-muted-foreground">
                            Exporte dados completos ou apenas registros regularizados em formato Excel.
                          </p>
                        </Card>
                      </div>
                    </div>

                    <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 mt-6">
                      <div className="text-center">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          💡 <strong>Lembre-se:</strong> Este sistema é totalmente gratuito e funciona localmente. 
                          Sempre exporte seus dados após editar para não perder nenhuma informação!
                        </p>
                      </div>
                    </Card>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="registros" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">
                    Irregularidades Ativas
                  </h2>
                  {selectedStatus === "regularizado" && filteredData.length > 0 && (
                    <Button onClick={handleExportRegularizadosExcel} variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      Exportar Excel
                    </Button>
                  )}
                </div>
                <IrregularityTable 
                  data={filteredData} 
                  onUpdateRegularizado={handleUpdateRegularizado}
                  onUpdateEmCampo={handleUpdateEmCampo}
                />
              </TabsContent>

              <TabsContent value="verificacao-jvm" className="space-y-4">
                <div className="space-y-4">
                  <Card className="p-6 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-orange-900 dark:text-orange-100 mb-2">
                          Registros Aguardando Verificação JVM
                        </h3>
                        <p className="text-sm text-orange-800 dark:text-orange-200">
                          Estes registros foram previamente regularizados mas reapareceram no arquivo semanal mais recente.
                          A equipe JVM precisa verificar se realmente voltaram a estar irregulares ou se é um erro de notificação.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">
                      Registros para Verificação ({aguardandoVerificacaoData.length})
                    </h2>
                    {aguardandoVerificacaoData.length > 0 && (
                      <Button onClick={handleExportAguardandoJVMExcel} variant="outline" className="gap-2" data-testid="button-export-jvm">
                        <Download className="w-4 h-4" />
                        Exportar Excel
                      </Button>
                    )}
                  </div>

                  <VerificacaoJVMTable 
                    data={aguardandoVerificacaoData} 
                    onConfirmarVerificacao={handleConfirmarVerificacaoJVM}
                  />
                </div>
              </TabsContent>

              <TabsContent value="em-campo" className="space-y-4">
                <div className="space-y-4">
                  <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100 mb-2">
                          Registros Em Campo
                        </h3>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          Estes registros foram marcados como "Em Campo" para indicar que a equipe está fazendo verificação presencial no local.
                          Use o botão "Marcar Em Campo" na aba de irregularidades para adicionar registros aqui.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">
                      Irregularidades Em Campo ({emCampoData.length})
                    </h2>
                  </div>

                  <IrregularityTable 
                    data={emCampoData} 
                    onUpdateRegularizado={handleUpdateRegularizado}
                    onUpdateEmCampo={handleUpdateEmCampo}
                  />
                </div>
              </TabsContent>

              <TabsContent value="analises" className="space-y-4">
                <h2 className="text-2xl font-semibold">Análises e Insights</h2>
                <AnalysisDashboard data={data} />
              </TabsContent>

              <TabsContent value="grafico" className="space-y-4">
                {fluxoData.length > 0 ? (
                  <FluxoChart data={fluxoData} />
                ) : (
                  <Card className="p-12">
                    <div className="text-center text-muted-foreground">
                      <p className="text-lg">Nenhum dado de gráfico disponível</p>
                      <p className="text-sm mt-2">Os dados do gráfico serão exibidos após importar um arquivo completo</p>
                    </div>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
      <footer className="mt-8 py-4 border-t border-border/50 backdrop-blur-md bg-background/60">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground" data-testid="footer-developer">
          Desenvolvido por: <span className="font-semibold text-foreground">ODAIR-JDEV</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
