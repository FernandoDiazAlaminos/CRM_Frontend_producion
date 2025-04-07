import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AdsPerformance = ({ data = [] }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'spent', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');

  if (!data || data.length === 0) {
    return null;
  }

  // Ordenar campañas
  const sortedCampaigns = [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filtrar campañas
  const filteredCampaigns = sortedCampaigns.filter(campaign => 
    campaign.campaign.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Cambiar ordenamiento
  const requestSort = (key) => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        return { 
          key, 
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' 
        };
      }
      return { key, direction: 'desc' };
    });
  };

  // Calcular totales
  const totals = data.reduce((acc, campaign) => {
    acc.budget += campaign.budget;
    acc.spent += campaign.spent;
    acc.impressions += campaign.impressions;
    acc.clicks += campaign.clicks;
    acc.conversions += campaign.conversions;
    return acc;
  }, { budget: 0, spent: 0, impressions: 0, clicks: 0, conversions: 0 });

  // Calcular métricas agregadas
  const aggregateMetrics = {
    ctr: (totals.clicks / totals.impressions) * 100 || 0,
    cpc: totals.clicks ? totals.spent / totals.clicks : 0,
    conversionRate: (totals.conversions / totals.clicks) * 100 || 0,
    costPerConversion: totals.conversions ? totals.spent / totals.conversions : 0
  };

  // Animación para componentes
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Rendimiento de Google Ads
          </h3>
          
          {/* Buscador de campañas */}
          <div className="mt-2 md:mt-0 w-full md:w-64 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-2 px-3 ps-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
              placeholder="Buscar campañas..."
            />
            <div className="absolute inset-y-0 start-0 flex items-center ps-3">
              <svg className="size-4 text-gray-400 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Resumen de métricas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">Presupuesto</p>
            <p className="text-lg font-bold text-gray-800 dark:text-white mt-1">
              {totals.budget.toFixed(2)}€
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">Gasto</p>
            <p className="text-lg font-bold text-gray-800 dark:text-white mt-1">
              {totals.spent.toFixed(2)}€
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {((totals.spent / totals.budget) * 100).toFixed(1)}% del presupuesto
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">Impresiones</p>
            <p className="text-lg font-bold text-gray-800 dark:text-white mt-1">
              {totals.impressions.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">Clics</p>
            <p className="text-lg font-bold text-gray-800 dark:text-white mt-1">
              {totals.clicks.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              CTR: {aggregateMetrics.ctr.toFixed(2)}%
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">Conversiones</p>
            <p className="text-lg font-bold text-gray-800 dark:text-white mt-1">
              {totals.conversions.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Tasa: {aggregateMetrics.conversionRate.toFixed(2)}%
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">Coste por conv.</p>
            <p className="text-lg font-bold text-gray-800 dark:text-white mt-1">
              {aggregateMetrics.costPerConversion.toFixed(2)}€
            </p>
          </div>
        </div>

        {/* Tabla de campañas */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('campaign')}
                >
                  <div className="flex items-center">
                    <span>Campaña</span>
                    {sortConfig.key === 'campaign' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('status')}
                >
                  <div className="flex items-center">
                    <span>Estado</span>
                    {sortConfig.key === 'status' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('spent')}
                >
                  <div className="flex items-center">
                    <span>Gasto</span>
                    {sortConfig.key === 'spent' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('impressions')}
                >
                  <div className="flex items-center">
                    <span>Imp.</span>
                    {sortConfig.key === 'impressions' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('clicks')}
                >
                  <div className="flex items-center">
                    <span>Clics</span>
                    {sortConfig.key === 'clicks' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('ctr')}
                >
                  <div className="flex items-center">
                    <span>CTR</span>
                    {sortConfig.key === 'ctr' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('conversions')}
                >
                  <div className="flex items-center">
                    <span>Conv.</span>
                    {sortConfig.key === 'conversions' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('costPerConversion')}
                >
                  <div className="flex items-center">
                    <span>CPA</span>
                    {sortConfig.key === 'costPerConversion' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('roi')}
                >
                  <div className="flex items-center">
                    <span>ROI</span>
                    {sortConfig.key === 'roi' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCampaigns.map((campaign, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {campaign.campaign}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      campaign.status === 'Activa' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {campaign.spent.toFixed(2)}€
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
                      <div 
                        className="bg-blue-600 h-1 rounded-full" 
                        style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {campaign.impressions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {campaign.clicks.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {campaign.ctr.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {campaign.conversions}
                    <div className="text-xs text-gray-400">
                      {campaign.conversionRate.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {campaign.costPerConversion.toFixed(2)}€
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={`${
                      campaign.roi > 200 
                        ? 'text-green-600 dark:text-green-400' 
                        : campaign.roi > 100 
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-red-600 dark:text-red-400'
                    }`}>
                      {campaign.roi}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdsPerformance;