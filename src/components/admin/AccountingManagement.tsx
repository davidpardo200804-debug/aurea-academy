import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building,
  Plus,
  Filter,
  Download,
  Printer,
  Search,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  Layers,
  ShieldCheck,
  Tag,
  CreditCard,
  Trash2,
  Eye,
  X,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Scissors,
  Sparkle,
} from 'lucide-react';
import { AccountingEntry, FixedAsset, FixedAssetCategory, FixedAssetCondition } from '../../types';
import { appStorage } from '../../services/storage';

export const AccountingManagement: React.FC = () => {
  const { currentUser, playSuccessSound, refreshData } = useApp();
  const store = appStorage.getStore();

  const [activeTab, setActiveTab] = useState<'balance' | 'ingresos' | 'egresos' | 'activos'>('balance');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'month' | 'quarter' | 'year'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Modals state
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<AccountingEntry | null>(null);

  // Form states for new Income
  const [incomeConcept, setIncomeConcept] = useState('');
  const [incomeCategory, setIncomeCategory] = useState<string>('Matrícula');
  const [incomeAmount, setIncomeAmount] = useState<number | ''>('');
  const [incomeDate, setIncomeDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [incomeMethod, setIncomeMethod] = useState<AccountingEntry['paymentMethod']>('Efectivo');
  const [incomeClient, setIncomeClient] = useState('');
  const [incomeVoucher, setIncomeVoucher] = useState('');
  const [incomeNotes, setIncomeNotes] = useState('');

  // Form states for new Expense
  const [expenseConcept, setExpenseConcept] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<string>('Insumos Químicos & Cosméticos');
  const [expenseAmount, setExpenseAmount] = useState<number | ''>('');
  const [expenseDate, setExpenseDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [expenseMethod, setExpenseMethod] = useState<AccountingEntry['paymentMethod']>('Transferencia Bancaria');
  const [expenseBeneficiary, setExpenseBeneficiary] = useState('');
  const [expenseVoucher, setExpenseVoucher] = useState('');
  const [expenseNotes, setExpenseNotes] = useState('');

  // Form states for new Fixed Asset
  const [assetCode, setAssetCode] = useState(`ACT-${String((store.fixedAssets?.length || 0) + 1).padStart(3, '0')}`);
  const [assetName, setAssetName] = useState('');
  const [assetCategory, setAssetCategory] = useState<FixedAssetCategory>('Mobiliario & Estaciones');
  const [assetDate, setAssetDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [assetCost, setAssetCost] = useState<number | ''>('');
  const [assetCurrentValue, setAssetCurrentValue] = useState<number | ''>('');
  const [assetCondition, setAssetCondition] = useState<FixedAssetCondition>('Excelente');
  const [assetLocation, setAssetLocation] = useState('Aula Central de Peluquería');
  const [assetBrand, setAssetBrand] = useState('');
  const [assetSerial, setAssetSerial] = useState('');
  const [assetNotes, setAssetNotes] = useState('');

  // Get data
  const entries: AccountingEntry[] = store.accounting || [];
  const fixedAssets: FixedAsset[] = store.fixedAssets || [];

  // Summary Metrics
  const totalIncomes = useMemo(() => {
    return entries
      .filter((e) => e.type === 'ingreso')
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [entries]);

  const totalExpenses = useMemo(() => {
    return entries
      .filter((e) => e.type === 'egreso')
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [entries]);

  const netBalance = totalIncomes - totalExpenses;

  const totalAssetsValue = useMemo(() => {
    return fixedAssets.reduce((sum, a) => sum + (Number(a.currentValue) || Number(a.purchaseCost) || 0), 0);
  }, [fixedAssets]);

  const totalAssetsHistoricalCost = useMemo(() => {
    return fixedAssets.reduce((sum, a) => sum + (Number(a.purchaseCost) || 0), 0);
  }, [fixedAssets]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      const matchSearch =
        e.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.beneficiaryOrClient && e.beneficiaryOrClient.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (e.voucherNumber && e.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        e.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = filterCategory === 'all' || e.category === filterCategory;

      return matchSearch && matchCategory;
    });
  }, [entries, searchTerm, filterCategory]);

  const incomesList = useMemo(() => filteredEntries.filter((e) => e.type === 'ingreso'), [filteredEntries]);
  const expensesList = useMemo(() => filteredEntries.filter((e) => e.type === 'egreso'), [filteredEntries]);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return fixedAssets.filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.brand && a.brand.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory = filterCategory === 'all' || a.category === filterCategory;

      return matchSearch && matchCategory;
    });
  }, [fixedAssets, searchTerm, filterCategory]);

  // Actions
  const handleSaveIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeConcept || !incomeAmount || Number(incomeAmount) <= 0) return;

    const newVoucher = incomeVoucher || `RC-${new Date().getFullYear()}-${String(incomesList.length + 1).padStart(3, '0')}`;

    appStorage.createAccountingEntry({
      type: 'ingreso',
      category: incomeCategory,
      concept: incomeConcept,
      amount: Number(incomeAmount),
      date: incomeDate,
      paymentMethod: incomeMethod,
      voucherNumber: newVoucher,
      beneficiaryOrClient: incomeClient || 'Cliente Particular',
      registeredBy: currentUser.name,
      notes: incomeNotes,
    });

    playSuccessSound();
    refreshData();
    setShowIncomeModal(false);

    // Reset
    setIncomeConcept('');
    setIncomeAmount('');
    setIncomeClient('');
    setIncomeVoucher('');
    setIncomeNotes('');
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseConcept || !expenseAmount || Number(expenseAmount) <= 0) return;

    const newVoucher = expenseVoucher || `CE-${new Date().getFullYear()}-${String(expensesList.length + 1).padStart(3, '0')}`;

    appStorage.createAccountingEntry({
      type: 'egreso',
      category: expenseCategory,
      concept: expenseConcept,
      amount: Number(expenseAmount),
      date: expenseDate,
      paymentMethod: expenseMethod,
      voucherNumber: newVoucher,
      beneficiaryOrClient: expenseBeneficiary || 'Proveedor General',
      registeredBy: currentUser.name,
      notes: expenseNotes,
    });

    playSuccessSound();
    refreshData();
    setShowExpenseModal(false);

    // Reset
    setExpenseConcept('');
    setExpenseAmount('');
    setExpenseBeneficiary('');
    setExpenseVoucher('');
    setExpenseNotes('');
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName || !assetCost || Number(assetCost) <= 0) return;

    appStorage.createFixedAsset({
      code: assetCode || `ACT-${String(fixedAssets.length + 1).padStart(3, '0')}`,
      name: assetName,
      category: assetCategory,
      purchaseDate: assetDate,
      purchaseCost: Number(assetCost),
      currentValue: assetCurrentValue ? Number(assetCurrentValue) : Number(assetCost),
      condition: assetCondition,
      location: assetLocation,
      brand: assetBrand,
      serialNumber: assetSerial,
      assignedTo: currentUser.name,
      notes: assetNotes,
    });

    playSuccessSound();
    refreshData();
    setShowAssetModal(false);

    // Reset
    setAssetName('');
    setAssetCost('');
    setAssetCurrentValue('');
    setAssetBrand('');
    setAssetSerial('');
    setAssetNotes('');
    setAssetCode(`ACT-${String(fixedAssets.length + 2).padStart(3, '0')}`);
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('¿Deseas eliminar este registro contable?')) {
      appStorage.deleteAccountingEntry(id);
      refreshData();
    }
  };

  const handleDeleteAsset = (id: string) => {
    if (window.confirm('¿Deseas dar de baja o eliminar este activo fijo del inventario?')) {
      appStorage.deleteFixedAsset(id);
      refreshData();
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Tipo,Comprobante,Fecha,Categoria,Concepto,Cliente_Proveedor,Metodo_Pago,Monto_COP,Registrado_Por\n';

    entries.forEach((e) => {
      const row = [
        e.type.toUpperCase(),
        `"${e.voucherNumber || ''}"`,
        e.date,
        `"${e.category}"`,
        `"${e.concept.replace(/"/g, '""')}"`,
        `"${(e.beneficiaryOrClient || '').replace(/"/g, '""')}"`,
        `"${e.paymentMethod}"`,
        e.amount,
        `"${e.registeredBy}"`,
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Arte_Estilo_Contabilidad_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner - Dark Blue with Light Sky Blue and Lilac Touches */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b132b] via-[#1c2541] to-[#1e1b4b] border border-sky-500/25 p-6 sm:p-8 shadow-2xl text-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-gradient-to-br from-sky-500/20 to-purple-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 rounded-full bg-purple-500/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg shadow-sky-500/20 shrink-0 border border-sky-400/40 flex items-center justify-center">
              <img
                src="/logo.jpg"
                alt="Arte & Estilo"
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold mb-2">
                <Scissors className="w-3.5 h-3.5 text-purple-300" />
                <span>Arte & Estilo • Academia de Belleza • Módulo Contable</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Contabilidad, Tesorería & Activos Fijos
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Control contable integral: gestión de ingresos (matrículas, cursos, kits, servicios del salón escuela),
                egresos (nómina de docentes e insumos) e inventario patrimonial de activos fijos con depreciación.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowIncomeModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-sky-500/25 transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Ingreso</span>
            </button>

            <button
              onClick={() => setShowExpenseModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/25 transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Egreso</span>
            </button>

            <button
              onClick={() => setShowAssetModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-sky-200 border border-sky-400/30 text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
            >
              <Building className="w-4 h-4 text-purple-300" />
              <span>+ Activo Fijo</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              title="Descargar libro en CSV"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {/* Card 1: Ingresos */}
          <div className="bg-[#0b132b]/80 backdrop-blur-md rounded-2xl p-4 border border-sky-500/30 flex items-center space-x-3.5 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0 border border-sky-500/30">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-sky-200 uppercase tracking-wider block">Total Ingresos</span>
              <span className="text-xl font-black text-white tracking-tight">
                ${totalIncomes.toLocaleString('es-CO')}
              </span>
              <span className="text-[10px] text-sky-300 flex items-center space-x-1 mt-0.5">
                <ArrowUpRight className="w-3 h-3 text-sky-400" />
                <span>{incomesList.length} cobros registrados</span>
              </span>
            </div>
          </div>

          {/* Card 2: Egresos */}
          <div className="bg-[#0b132b]/80 backdrop-blur-md rounded-2xl p-4 border border-purple-500/30 flex items-center space-x-3.5 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 border border-purple-500/30">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider block">Total Egresos</span>
              <span className="text-xl font-black text-white tracking-tight">
                ${totalExpenses.toLocaleString('es-CO')}
              </span>
              <span className="text-[10px] text-purple-300 flex items-center space-x-1 mt-0.5">
                <ArrowDownRight className="w-3 h-3 text-purple-400" />
                <span>{expensesList.length} pagos / nómina</span>
              </span>
            </div>
          </div>

          {/* Card 3: Utilidad / Saldo */}
          <div
            className={`bg-[#0b132b]/80 backdrop-blur-md rounded-2xl p-4 border flex items-center space-x-3.5 shadow-md ${
              netBalance >= 0 ? 'border-emerald-500/30' : 'border-rose-500/30'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                netBalance >= 0
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}
            >
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider block text-slate-300">
                Flujo Neto (Caja)
              </span>
              <span
                className={`text-xl font-black tracking-tight ${
                  netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                ${netBalance.toLocaleString('es-CO')}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {netBalance >= 0 ? 'Superávit saludable' : 'Déficit del periodo'}
              </span>
            </div>
          </div>

          {/* Card 4: Activos Fijos */}
          <div className="bg-[#0b132b]/80 backdrop-blur-md rounded-2xl p-4 border border-sky-400/30 flex items-center space-x-3.5 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500/20 to-purple-500/20 text-sky-200 flex items-center justify-center shrink-0 border border-sky-400/30">
              <Building className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-sky-200 uppercase tracking-wider block">
                Patrimonio Activos
              </span>
              <span className="text-xl font-black text-white tracking-tight">
                ${totalAssetsValue.toLocaleString('es-CO')}
              </span>
              <span className="text-[10px] text-purple-300 block mt-0.5">
                {fixedAssets.length} bienes inventariados
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sky-900/40 pb-4">
        <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-2xl border border-sky-500/20">
          <button
            onClick={() => setActiveTab('balance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'balance'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Balance & Métricas</span>
          </button>

          <button
            onClick={() => setActiveTab('ingresos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'ingresos'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-sky-300" />
            <span>Ingresos ({incomesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('egresos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'egresos'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingDown className="w-4 h-4 text-purple-300" />
            <span>Egresos ({expensesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('activos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'activos'
                ? 'bg-gradient-to-r from-sky-500 to-purple-600 text-white shadow-md shadow-sky-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building className="w-4 h-4 text-purple-300" />
            <span>Activos Fijos ({fixedAssets.length})</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por concepto, comprobante..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>
        </div>
      </div>

      {/* TAB 1: BALANCE & MÉTRICAS GENERALES */}
      {activeTab === 'balance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Box 1: Breakdown of Incomes by Category */}
            <div className="bg-slate-900/90 border border-sky-500/20 rounded-3xl p-6 shadow-xl text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Distribución de Ingresos</h3>
                    <p className="text-xs text-slate-400">Origen de los recursos en Arte & Estilo</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/30">
                  ${totalIncomes.toLocaleString('es-CO')}
                </span>
              </div>

              {/* Progress bars by category */}
              <div className="space-y-3.5 mt-4">
                {[
                  { label: 'Matrículas & Cursos', cat: 'Matrícula', color: 'from-sky-500 to-blue-600' },
                  { label: 'Mensualidades / Cuotas', cat: 'Mensualidad / Curso', color: 'from-blue-500 to-indigo-600' },
                  { label: 'Servicios Salón Escuela', cat: 'Servicios Salón Escuela', color: 'from-purple-500 to-pink-500' },
                  { label: 'Venta Kits & Cosméticos', cat: 'Venta Kits & Cosméticos', color: 'from-amber-400 to-orange-500' },
                  { label: 'Certificados & Diplomas', cat: 'Certificados & Diplomas', color: 'from-emerald-400 to-teal-500' },
                ].map((item) => {
                  const catTotal = entries
                    .filter((e) => e.type === 'ingreso' && e.category.toLowerCase().includes(item.cat.toLowerCase().slice(0, 5)))
                    .reduce((sum, e) => sum + e.amount, 0);
                  const pct = totalIncomes > 0 ? Math.round((catTotal / totalIncomes) * 100) : 0;

                  return (
                    <div key={item.cat} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">{item.label}</span>
                        <span className="text-white font-bold">
                          ${catTotal.toLocaleString('es-CO')}{' '}
                          <span className="text-slate-400 text-[10px]">({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Box 2: Breakdown of Expenses by Category */}
            <div className="bg-slate-900/90 border border-purple-500/20 rounded-3xl p-6 shadow-xl text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Distribución de Egresos</h3>
                    <p className="text-xs text-slate-400">Costos operativos y nómina formativa</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/30">
                  ${totalExpenses.toLocaleString('es-CO')}
                </span>
              </div>

              {/* Progress bars by expense category */}
              <div className="space-y-3.5 mt-4">
                {[
                  { label: 'Nómina & Cuentas Docentes', cat: 'Nómina', color: 'from-purple-600 to-indigo-600' },
                  { label: 'Arriendo Sede Principal', cat: 'Arriendo', color: 'from-rose-500 to-pink-600' },
                  { label: 'Insumos Químicos & Tintes', cat: 'Insumos', color: 'from-sky-500 to-cyan-500' },
                  { label: 'Servicios Públicos (Luz/Agua)', cat: 'Servicios', color: 'from-amber-500 to-yellow-500' },
                  { label: 'Mantenimiento & Reparación', cat: 'Mantenimiento', color: 'from-emerald-500 to-teal-500' },
                  { label: 'Marketing & Publicidad', cat: 'Marketing', color: 'from-fuchsia-500 to-purple-500' },
                ].map((item) => {
                  const catTotal = entries
                    .filter((e) => e.type === 'egreso' && e.category.toLowerCase().includes(item.cat.toLowerCase().slice(0, 5)))
                    .reduce((sum, e) => sum + e.amount, 0);
                  const pct = totalExpenses > 0 ? Math.round((catTotal / totalExpenses) * 100) : 0;

                  return (
                    <div key={item.cat} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">{item.label}</span>
                        <span className="text-white font-bold">
                          ${catTotal.toLocaleString('es-CO')}{' '}
                          <span className="text-slate-400 text-[10px]">({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Fixed Assets Summary Table Preview */}
          <div className="bg-slate-900/90 border border-sky-500/20 rounded-3xl p-6 shadow-xl text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Resumen de Activos Fijos & Equipamiento de Belleza</h3>
                  <p className="text-xs text-slate-400">
                    Costo histórico: ${totalAssetsHistoricalCost.toLocaleString('es-CO')} • Valor actual estimado: $
                    {totalAssetsValue.toLocaleString('es-CO')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('activos')}
                className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center space-x-1"
              >
                <span>Ver inventario completo</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {fixedAssets.slice(0, 6).map((asset) => (
                <div
                  key={asset.id}
                  className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-sky-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                        {asset.code}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          asset.condition === 'Excelente'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : asset.condition === 'Bueno'
                            ? 'bg-sky-500/20 text-sky-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {asset.condition}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-2">{asset.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
                      <span>📍 {asset.location}</span>
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-700/50 flex justify-between items-center text-xs">
                    <span className="text-slate-400 text-[11px]">Valor Actual:</span>
                    <span className="font-extrabold text-white">${asset.currentValue.toLocaleString('es-CO')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TABLA DE INGRESOS */}
      {activeTab === 'ingresos' && (
        <div className="bg-slate-900/90 border border-sky-500/20 rounded-3xl p-6 shadow-xl text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-sky-400" />
                <span>Libro Auxiliar de Ingresos</span>
              </h3>
              <p className="text-xs text-slate-400">
                Pagos acreditados por estudiantes, acudientes y clientes del salón escuela
              </p>
            </div>
            <button
              onClick={() => setShowIncomeModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Ingreso</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700 font-semibold">
                  <th className="py-3 px-4">Comprobante</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Concepto</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Cliente / Alumno</th>
                  <th className="py-3 px-4">Método</th>
                  <th className="py-3 px-4 text-right">Monto</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {incomesList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No se encontraron ingresos registrados con los criterios seleccionados.
                    </td>
                  </tr>
                ) : (
                  incomesList.map((inc) => (
                    <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-sky-400">{inc.voucherNumber || 'S/N'}</td>
                      <td className="py-3 px-4 text-slate-300">{inc.date}</td>
                      <td className="py-3 px-4 font-medium text-white max-w-xs truncate">{inc.concept}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                          {inc.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{inc.beneficiaryOrClient || 'Particular'}</td>
                      <td className="py-3 px-4 text-slate-400">{inc.paymentMethod}</td>
                      <td className="py-3 px-4 text-right font-black text-emerald-400">
                        +${inc.amount.toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => setSelectedReceipt(inc)}
                            className="p-1.5 rounded-lg text-sky-400 hover:text-white hover:bg-sky-500/20 transition-colors cursor-pointer"
                            title="Ver e imprimir recibo oficial"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(inc.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors cursor-pointer"
                            title="Eliminar ingreso"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TABLA DE EGRESOS */}
      {activeTab === 'egresos' && (
        <div className="bg-slate-900/90 border border-purple-500/20 rounded-3xl p-6 shadow-xl text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-white flex items-center space-x-2">
                <TrendingDown className="w-5 h-5 text-purple-400" />
                <span>Libro Auxiliar de Egresos & Gastos</span>
              </h3>
              <p className="text-xs text-slate-400">
                Pagos a proveedores de insumos de belleza, nómina docente y arriendo de la academia
              </p>
            </div>
            <button
              onClick={() => setShowExpenseModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Egreso</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700 font-semibold">
                  <th className="py-3 px-4">Comprobante</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Concepto</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Beneficiario / Proveedor</th>
                  <th className="py-3 px-4">Método</th>
                  <th className="py-3 px-4 text-right">Monto</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {expensesList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No se encontraron egresos registrados.
                    </td>
                  </tr>
                ) : (
                  expensesList.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-purple-400">{exp.voucherNumber || 'S/N'}</td>
                      <td className="py-3 px-4 text-slate-300">{exp.date}</td>
                      <td className="py-3 px-4 font-medium text-white max-w-xs truncate">{exp.concept}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{exp.beneficiaryOrClient || 'Proveedor'}</td>
                      <td className="py-3 px-4 text-slate-400">{exp.paymentMethod}</td>
                      <td className="py-3 px-4 text-right font-black text-rose-400">
                        -${exp.amount.toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => setSelectedReceipt(exp)}
                            className="p-1.5 rounded-lg text-purple-400 hover:text-white hover:bg-purple-500/20 transition-colors cursor-pointer"
                            title="Ver comprobante de egreso"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(exp.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors cursor-pointer"
                            title="Eliminar egreso"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ACTIVOS FIJOS */}
      {activeTab === 'activos' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-sky-500/20 rounded-3xl p-6 shadow-xl text-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-white flex items-center space-x-2">
                  <Building className="w-5 h-5 text-sky-400" />
                  <span>Inventario de Activos Fijos & Bienes Institucionales</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Sillones de peluquería, lavacabezas, secadores profesionales, vaporizadores y tecnología
                </p>
              </div>
              <button
                onClick={() => setShowAssetModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Activo Fijo</span>
              </button>
            </div>

            {/* Grid of assets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-slate-800/80 border border-slate-700/80 hover:border-sky-500/40 rounded-2xl p-4 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-sky-300 bg-sky-500/15 px-2.5 py-0.5 rounded border border-sky-400/30">
                        {asset.code}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          asset.condition === 'Excelente'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : asset.condition === 'Bueno'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {asset.condition}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white">{asset.name}</h4>
                    <p className="text-xs text-purple-300 font-medium mt-0.5">{asset.category}</p>

                    <div className="mt-3 space-y-1 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Ubicación:</span>
                        <span className="font-semibold text-white">{asset.location}</span>
                      </div>
                      {asset.brand && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Marca / Modelo:</span>
                          <span className="font-semibold text-white">{asset.brand}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-400">Fecha Adquisición:</span>
                        <span>{asset.purchaseDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Valor Actual:</span>
                      <span className="text-sm font-black text-white">
                        ${asset.currentValue.toLocaleString('es-CO')}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors cursor-pointer"
                      title="Dar de baja o eliminar activo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: REGISTRAR INGRESO */}
      {/* ======================================================== */}
      {showIncomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-sky-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl text-white">
            <button
              onClick={() => setShowIncomeModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Registrar Ingreso Contable</h3>
                <p className="text-xs text-slate-400">Recibo de Caja para Arte & Estilo</p>
              </div>
            </div>

            <form onSubmit={handleSaveIncome} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Concepto del Pago *</label>
                <input
                  type="text"
                  required
                  value={incomeConcept}
                  onChange={(e) => setIncomeConcept(e.target.value)}
                  placeholder="Ej: Matrícula Curso Colorimetría y Balayage - Módulo 1"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
                  <select
                    value={incomeCategory}
                    onChange={(e) => setIncomeCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  >
                    <option value="Matrícula">Matrícula</option>
                    <option value="Mensualidad / Curso">Mensualidad / Curso</option>
                    <option value="Servicios Salón Escuela">Servicios Salón Escuela</option>
                    <option value="Venta Kits & Cosméticos">Venta Kits & Cosméticos</option>
                    <option value="Seminarios & Masterclasses">Seminarios & Masterclasses</option>
                    <option value="Certificados & Diplomas">Certificados & Diplomas</option>
                    <option value="Otros Ingresos">Otros Ingresos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Monto (COP) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Ej: 350000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Estudiante o Cliente</label>
                  <input
                    type="text"
                    value={incomeClient}
                    onChange={(e) => setIncomeClient(e.target.value)}
                    placeholder="Nombre completo"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Método de Pago</label>
                  <select
                    value={incomeMethod}
                    onChange={(e) => setIncomeMethod(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Nequi">Nequi</option>
                    <option value="Daviplata">Daviplata</option>
                    <option value="Transferencia Bancaria">Bancolombia / Transferencia</option>
                    <option value="Tarjeta Débito/Crédito">Tarjeta Débito/Crédito</option>
                    <option value="PSE">PSE en línea</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={incomeDate}
                    onChange={(e) => setIncomeDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">N° Recibo / Soporte</label>
                  <input
                    type="text"
                    value={incomeVoucher}
                    onChange={(e) => setIncomeVoucher(e.target.value)}
                    placeholder="Autogenerado (ej: RC-2026-008)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notas u Observaciones</label>
                <textarea
                  rows={2}
                  value={incomeNotes}
                  onChange={(e) => setIncomeNotes(e.target.value)}
                  placeholder="Detalles adicionales del abono o pago..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIncomeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-sky-500/25"
                >
                  Guardar Ingreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: REGISTRAR EGRESO */}
      {/* ======================================================== */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl text-white">
            <button
              onClick={() => setShowExpenseModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Registrar Egreso / Gasto</h3>
                <p className="text-xs text-slate-400">Comprobante de Egreso Oficial</p>
              </div>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Concepto del Gasto *</label>
                <input
                  type="text"
                  required
                  value={expenseConcept}
                  onChange={(e) => setExpenseConcept(e.target.value)}
                  placeholder="Ej: Compra de tintes y decolorante Wella Blondor para taller práctico"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="Insumos Químicos & Cosméticos">Insumos Químicos & Cosméticos</option>
                    <option value="Nómina & Honorarios Docentes">Nómina & Honorarios Docentes</option>
                    <option value="Arriendo de Sede">Arriendo de Sede</option>
                    <option value="Servicios Públicos (Agua/Luz/Net)">Servicios Públicos (Agua/Luz/Net)</option>
                    <option value="Mantenimiento de Equipos">Mantenimiento de Equipos</option>
                    <option value="Marketing, Redes & Publicidad">Marketing, Redes & Publicidad</option>
                    <option value="Papelería & Aseo">Papelería & Aseo</option>
                    <option value="Otros Egresos">Otros Egresos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Monto (COP) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Ej: 450000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Beneficiario / Proveedor</label>
                  <input
                    type="text"
                    value={expenseBeneficiary}
                    onChange={(e) => setExpenseBeneficiary(e.target.value)}
                    placeholder="Distribuidora Belleza Pro / Docente"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Método de Pago</label>
                  <select
                    value={expenseMethod}
                    onChange={(e) => setExpenseMethod(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                    <option value="Nequi">Nequi</option>
                    <option value="Daviplata">Daviplata</option>
                    <option value="Efectivo">Efectivo de Caja Menor</option>
                    <option value="Tarjeta Débito/Crédito">Tarjeta Débito/Crédito</option>
                    <option value="PSE">PSE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">N° Comprobante / Factura</label>
                  <input
                    type="text"
                    value={expenseVoucher}
                    onChange={(e) => setExpenseVoucher(e.target.value)}
                    placeholder="Autogenerado (ej: CE-2026-008)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notas u Observaciones</label>
                <textarea
                  rows={2}
                  value={expenseNotes}
                  onChange={(e) => setExpenseNotes(e.target.value)}
                  placeholder="Detalles de la factura o soporte..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/25"
                >
                  Guardar Egreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: REGISTRAR ACTIVO FIJO */}
      {/* ======================================================== */}
      {showAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-sky-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl text-white">
            <button
              onClick={() => setShowAssetModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Registrar Activo Fijo / Equipamiento</h3>
                <p className="text-xs text-slate-400">Inventario y Placa Patrimonial</p>
              </div>
            </div>

            <form onSubmit={handleSaveAsset} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Código / Placa *</label>
                  <input
                    type="text"
                    required
                    value={assetCode}
                    onChange={(e) => setAssetCode(e.target.value)}
                    placeholder="ACT-010"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400 font-mono font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Activo *</label>
                  <input
                    type="text"
                    required
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    placeholder="Ej: Secador Profesional Parlux 385 PowerLight"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
                  <select
                    value={assetCategory}
                    onChange={(e) => setAssetCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  >
                    <option value="Mobiliario & Estaciones">Mobiliario & Estaciones</option>
                    <option value="Equipos Térmicos & Eléctricos">Equipos Térmicos & Eléctricos</option>
                    <option value="Herramientas de Corte & Estilo">Herramientas de Corte & Estilo</option>
                    <option value="Estética Facial & Corporal">Estética Facial & Corporal</option>
                    <option value="Cómputo & Tecnología">Cómputo & Tecnología</option>
                    <option value="Seguridad & Bioseguridad">Seguridad & Bioseguridad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Condición / Estado</label>
                  <select
                    value={assetCondition}
                    onChange={(e) => setAssetCondition(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  >
                    <option value="Excelente">Excelente</option>
                    <option value="Bueno">Bueno</option>
                    <option value="Regular">Regular</option>
                    <option value="En Mantenimiento">En Mantenimiento</option>
                    <option value="De Baja">De Baja</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Costo Histórico Compra *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={assetCost}
                    onChange={(e) => setAssetCost(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Ej: 650000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Valor Actual Estimado</label>
                  <input
                    type="number"
                    value={assetCurrentValue}
                    onChange={(e) => setAssetCurrentValue(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Ej: 580000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ubicación en Sede</label>
                  <input
                    type="text"
                    value={assetLocation}
                    onChange={(e) => setAssetLocation(e.target.value)}
                    placeholder="Aula 1 Peluquería / Cabina Estética"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Marca / Serial</label>
                  <input
                    type="text"
                    value={assetBrand}
                    onChange={(e) => setAssetBrand(e.target.value)}
                    placeholder="Ej: Parlux / Babyliss / Wahl"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssetModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-sky-500/25"
                >
                  Guardar en Inventario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: VER / IMPRIMIR COMPROBANTE OFICIAL (RECIBO) */}
      {/* ======================================================== */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-sky-500/30 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt printable container */}
            <div className="space-y-6">
              {/* Header with official logo */}
              <div className="flex items-center justify-between border-b pb-4 border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 rounded-2xl bg-white p-1 border border-slate-200 shadow-sm flex items-center justify-center">
                    <img src="/logo.jpg" alt="Arte & Estilo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Arte & Estilo</h2>
                    <p className="text-[11px] font-bold tracking-widest text-sky-700 uppercase">
                      ACADEMIA DE BELLEZA
                    </p>
                    <p className="text-[10px] text-slate-500">NIT: 901.442.819-3 • Registro Educación No Formal</p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      selectedReceipt.type === 'ingreso'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {selectedReceipt.type === 'ingreso' ? 'Recibo de Caja' : 'Comprobante de Egreso'}
                  </span>
                  <p className="text-xs font-mono font-bold text-slate-700 mt-1">
                    N° {selectedReceipt.voucherNumber || 'S/N'}
                  </p>
                  <p className="text-[10px] text-slate-500">Fecha: {selectedReceipt.date}</p>
                </div>
              </div>

              {/* Body */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-600">
                    {selectedReceipt.type === 'ingreso' ? 'Recibido de:' : 'Pagado a:'}
                  </span>
                  <span className="font-bold text-slate-900">{selectedReceipt.beneficiaryOrClient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-600">Por concepto de:</span>
                  <span className="font-medium text-slate-900 max-w-xs text-right">{selectedReceipt.concept}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-600">Categoría contable:</span>
                  <span className="font-semibold text-sky-700">{selectedReceipt.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-600">Forma de pago:</span>
                  <span className="font-medium text-slate-900">{selectedReceipt.paymentMethod}</span>
                </div>
                {selectedReceipt.notes && (
                  <div className="pt-2 border-t border-slate-200 text-slate-600">
                    <span className="font-semibold">Observaciones: </span>
                    <span>{selectedReceipt.notes}</span>
                  </div>
                )}
              </div>

              {/* Amount Box */}
              <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-sky-300 block">Total Liquidado</span>
                  <span className="text-xs text-slate-300">Moneda Legal Colombiana (COP)</span>
                </div>
                <div className="text-2xl font-black text-white">
                  ${selectedReceipt.amount.toLocaleString('es-CO')}
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200 text-center text-xs">
                <div>
                  <div className="h-10 border-b border-dashed border-slate-400 mb-1" />
                  <p className="font-bold text-slate-800">{selectedReceipt.registeredBy}</p>
                  <p className="text-[10px] text-slate-500">Tesorería & Administración</p>
                </div>
                <div>
                  <div className="h-10 border-b border-dashed border-slate-400 mb-1" />
                  <p className="font-bold text-slate-800">{selectedReceipt.beneficiaryOrClient || 'Firma Cliente'}</p>
                  <p className="text-[10px] text-slate-500">Firma de Conformidad</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 print:hidden">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4 text-sky-400" />
                <span>Imprimir / Guardar PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
