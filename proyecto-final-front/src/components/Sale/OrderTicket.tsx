import type { SaleItem } from '../../types/sale';

interface OrderTicketProps {
  items: SaleItem[];
  processing: boolean;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function OrderTicket({
  items,
  processing,
  onUpdateQuantity,
  onRemove,
  onCancel,
  onConfirm,
}: OrderTicketProps) {
  // calculo de totales
  const totalAmount = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="lg:w-2/5 flex flex-col h-full bg-base-100 shadow-xl border border-base-200 rounded-xl overflow-hidden relative">
      {/* header del ticker */}
      <div className="bg-primary text-primary-content p-5 flex justify-between items-center shadow-md z-10">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Orden Actual
          </h2>
          <p className="text-xs opacity-80">Nueva transacción</p>
        </div>
        <div className="text-right">
          <div className="text-xs opacity-70 uppercase font-bold">Fecha</div>
          <div className="font-mono text-sm">{new Date().toLocaleDateString()}</div>
        </div>
      </div>

      {/* cuerpo del ticket donde van los items */}
      <div className="flex-1 overflow-y-auto p-0 bg-base-100 relative">
        {items.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-base-content/30 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 mb-4 opacity-20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="font-semibold">Sin items en la orden</p>
          </div>
        )}

        <table className="table table-xs w-full">
          {' '}
          {/* tabla */}
          <thead className="bg-base-200 text-base-content/70 sticky top-0 z-10">
            <tr>
              <th className="pl-4 py-3">Descripción</th>
              <th className="text-center">Cant.</th>
              <th className="text-right pr-4">Subtotal</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-100">
            {' '}
            {/* divide entre filas */}
            {items.map((item) => (
              <tr key={item.product._id}>
                <td className="pl-4 py-3">
                  <div className="font-bold text-sm text-base-content">{item.product.name}</div>
                  <div className="text-xs opacity-50 font-mono">${item.product.price} unit.</div>
                </td>
                <td className="text-center">
                  <input
                    type="number"
                    className="input input-xs input-ghost w-12 text-center focus:bg-base-200 font-bold"
                    value={item.quantity}
                    onChange={(e) =>
                      onUpdateQuantity(item.product._id, parseInt(e.target.value) || 0)
                    }
                    min="1"
                  />
                </td>
                <td className="text-right font-mono font-bold text-base-content pr-4">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </td>
                <td className="text-center pr-2">
                  <button
                    className="btn btn-ghost btn-xs text-error btn-square hover:bg-error/10"
                    onClick={() => onRemove(item.product._id)}
                    data-tip="Quitar"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* footer de valores totales y acciones */}
      <div className="p-6 bg-base-100 border-t border-base-200 shadow-[0_-5px_10px_rgba(0,0,0,0.02)] z-10">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm text-base-content/70">
            <span>Artículos totales:</span>
            <span className="font-medium font-mono">{totalItems}</span>
          </div>
          <div className="flex justify-between items-end border-t border-dashed border-base-300 pt-4">
            <span className="text-lg font-bold text-base-content">Total a Pagar</span>
            <span className="text-3xl font-bold text-primary font-mono tracking-tight">
              ${totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            className="btn btn-ghost hover:bg-error/10 hover:text-error"
            disabled={items.length === 0 || processing}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className={`btn btn-primary shadow-lg shadow-primary/30 ${processing ? 'loading' : ''}`}
            disabled={items.length === 0 || processing}
            onClick={onConfirm}
          >
            {processing ? 'Procesando...' : 'Confirmar Venta →'}
          </button>
        </div>
      </div>
    </div>
  );
}
