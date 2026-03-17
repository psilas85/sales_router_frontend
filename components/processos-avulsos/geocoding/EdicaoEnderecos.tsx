//sales_router_frontend/components/processos-avulsos/geocoding/EdicaoEnderecos.tsx

"use client"

import { useState } from "react"
import api from "@/services/api"

export default function EdicaoEnderecos() {

  const [cidade, setCidade] = useState("")
  const [uf, setUf] = useState("")
  const [endereco, setEndereco] = useState("")
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function buscar() {

    setLoading(true)

    try {

      const res = await api.get("/geocode/api/v1/cache/search", {
        params: { cidade, uf, endereco }
      })

      setData(res.data)

    } catch (err) {
      console.error(err)
    }

    setLoading(false)

  }

  async function salvar(id:number, lat:number, lon:number) {

    await api.put(`/geocode/api/v1/cache/${id}`, {
      lat,
      lon
    })

    alert("Atualizado com sucesso")

  }

  return (

    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h3 className="text-lg font-semibold">Edição de Endereços</h3>
        <p className="text-sm text-gray-500">
          Busque e edite coordenadas manualmente.
        </p>
      </div>

      {/* FILTROS */}
      <div className="flex gap-2 flex-wrap">

        <input
          placeholder="Cidade"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <input
          placeholder="UF"
          value={uf}
          onChange={(e) => setUf(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <input
          placeholder="Endereço"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />

        <button
          onClick={buscar}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>

      </div>

      {/* TABELA */}
      {loading && <p>Carregando...</p>}

      {!loading && data.length > 0 && (

        <table className="w-full border text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th>ID</th>
              <th>Endereço</th>
              <th>Lat</th>
              <th>Lon</th>
              <th>Ação</th>
            </tr>
          </thead>

          <tbody>

            {data.map((row) => (

              <tr key={row.id} className="border-t">

                <td className="p-2">{row.id}</td>

                <td className="p-2">{row.endereco}</td>

                <td className="p-2">
                  <input
                    defaultValue={row.lat}
                    onChange={(e) => row.lat = parseFloat(e.target.value)}
                    className="border px-2 py-1 w-28"
                  />
                </td>

                <td className="p-2">
                  <input
                    defaultValue={row.lon}
                    onChange={(e) => row.lon = parseFloat(e.target.value)}
                    className="border px-2 py-1 w-28"
                  />
                </td>

                <td className="p-2">
                  <button
                    onClick={() => salvar(row.id, row.lat, row.lon)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Salvar
                  </button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>

  )

}