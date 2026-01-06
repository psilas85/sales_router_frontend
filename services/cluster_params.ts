//services/cluster_params.ts

// ===========================================
// 📦 Campos dinâmicos por algoritmo
// ===========================================

export const PARAMS_BY_ALGO = {
  kmeans: {
    fields: [
      { key: "max_pdv_cluster", label: "Máx. PDVs por cluster", type: "number", default: 200 },
      { key: "dias_uteis", label: "Dias úteis no ciclo", type: "number", default: 20 },
      { key: "freq", label: "Frequência das visitas (por mês)", type: "number", default: 1 },
      { key: "workday", label: "Tempo máximo da rota (min)", type: "number", default: 600 },
      { key: "routekm", label: "Distância máxima da rota (km)", type: "number", default: 200 },
      { key: "service", label: "Tempo médio de serviço (min)", type: "number", default: 30 },
      { key: "vel", label: "Velocidade média (km/h)", type: "number", default: 35 },
      { key: "excluir_outliers", label: "Excluir outliers", type: "checkbox", default: false },
    ],
  },

  capacitated_sweep: {
    fields: [
      { key: "max_pdv_cluster", label: "Capacidade máxima (PDVs)", type: "number", default: 200 },
      { key: "excluir_outliers", label: "Excluir outliers", type: "checkbox", default: false },
    ],
  },

  dense_subset: {
    fields: [
      { key: "max_pdv_cluster", label: "Máximo de PDVs selecionados", type: "number", default: 200 },
      { key: "excluir_outliers", label: "Excluir outliers", type: "checkbox", default: false },
    ],
  },
};
