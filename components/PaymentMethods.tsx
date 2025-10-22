'use client'

import { useState } from 'react'
import { CreditCard, Smartphone, Building2, Wallet, Calendar, Zap, Shield, CheckCircle2, ChevronRight } from 'lucide-react'
import { WALLET_PROVIDERS, BANK_PROVIDERS, UPI_APPS, PAYMENT_METHODS } from '@/lib/juspay/config'

interface PaymentMethodsProps {
  amount: number
  onPaymentMethodSelect: (method: string, details: any) => void
  selectedMethod?: string
}

export default function PaymentMethods({ amount, onPaymentMethodSelect, selectedMethod }: PaymentMethodsProps) {
  const [activeTab, setActiveTab] = useState<string>(PAYMENT_METHODS.UPI)
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  })
  const [upiId, setUpiId] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [selectedWallet, setSelectedWallet] = useState('')

  const paymentTabs = [
    { id: PAYMENT_METHODS.UPI, label: 'UPI', icon: Smartphone, recommended: true },
    { id: PAYMENT_METHODS.CARD, label: 'Cards', icon: CreditCard },
    { id: PAYMENT_METHODS.NET_BANKING, label: 'Net Banking', icon: Building2 },
    { id: PAYMENT_METHODS.WALLET, label: 'Wallets', icon: Wallet },
    { id: PAYMENT_METHODS.EMI, label: 'EMI', icon: Calendar },
    { id: PAYMENT_METHODS.PAY_LATER, label: 'Pay Later', icon: Zap },
  ]

  const handleCardPayment = () => {
    if (cardDetails.number && cardDetails.name && cardDetails.expiry && cardDetails.cvv) {
      onPaymentMethodSelect(PAYMENT_METHODS.CARD, {
        ...cardDetails,
        amount,
      })
    }
  }

  const handleUpiPayment = () => {
    if (upiId) {
      onPaymentMethodSelect(PAYMENT_METHODS.UPI, {
        upiId,
        amount,
      })
    }
  }

  const handleBankPayment = () => {
    if (selectedBank) {
      onPaymentMethodSelect(PAYMENT_METHODS.NET_BANKING, {
        bank: selectedBank,
        amount,
      })
    }
  }

  const handleWalletPayment = () => {
    if (selectedWallet) {
      onPaymentMethodSelect(PAYMENT_METHODS.WALLET, {
        wallet: selectedWallet,
        amount,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Payment Method Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {paymentTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-400'
                  : 'bg-white hover:bg-gray-50 border-2 border-transparent'
              }`}
            >
              <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'text-primary-600' : 'text-gray-600'}`} />
              <span className={`text-xs font-medium ${activeTab === tab.id ? 'text-primary-700' : 'text-gray-700'}`}>
                {tab.label}
              </span>
              {tab.recommended && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  BEST
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Method Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        {/* UPI Payment */}
        {activeTab === PAYMENT_METHODS.UPI && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Smartphone className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Pay with UPI</h3>
                <p className="text-sm text-gray-500">Fast, secure, and instant payment</p>
              </div>
            </div>

            {/* UPI Apps */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Choose UPI App</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {UPI_APPS.map((app) => (
                  <button
                    key={app.id}
                    className="flex items-center gap-3 p-4 border-2 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-all"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center text-lg font-bold">
                      {app.icon}
                    </div>
                    <span className="font-medium text-gray-900">{app.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* UPI ID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Or Enter UPI ID</label>
              <input
                type="text"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleUpiPayment}
              disabled={!upiId}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shield className="w-5 h-5" />
              Pay ₹{amount.toLocaleString()} Securely
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Card Payment */}
        {activeTab === PAYMENT_METHODS.CARD && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Credit/Debit Cards</h3>
                <p className="text-sm text-gray-500">We accept all major cards</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  maxLength={19}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    maxLength={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    maxLength={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleCardPayment}
              disabled={!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shield className="w-5 h-5" />
              Pay ₹{amount.toLocaleString()} Securely
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Net Banking */}
        {activeTab === PAYMENT_METHODS.NET_BANKING && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="p-3 bg-green-100 rounded-lg">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Net Banking</h3>
                <p className="text-sm text-gray-500">Pay directly from your bank account</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {BANK_PROVIDERS.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => setSelectedBank(bank.id)}
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl transition-all ${
                    selectedBank === bank.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{bank.logo}</span>
                  <span className="text-sm font-medium text-gray-900">{bank.name}</span>
                  {selectedBank === bank.id && (
                    <CheckCircle2 className="w-5 h-5 text-primary-600 ml-auto" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleBankPayment}
              disabled={!selectedBank}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shield className="w-5 h-5" />
              Pay ₹{amount.toLocaleString()} Securely
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Wallets */}
        {activeTab === PAYMENT_METHODS.WALLET && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Wallet className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Digital Wallets</h3>
                <p className="text-sm text-gray-500">Fast and convenient payment</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {WALLET_PROVIDERS.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => setSelectedWallet(wallet.id)}
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all ${
                    selectedWallet === wallet.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center text-xl">
                    {wallet.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{wallet.name}</span>
                  {selectedWallet === wallet.id && (
                    <CheckCircle2 className="w-5 h-5 text-primary-600" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleWalletPayment}
              disabled={!selectedWallet}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shield className="w-5 h-5" />
              Pay ₹{amount.toLocaleString()} Securely
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* EMI */}
        {activeTab === PAYMENT_METHODS.EMI && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">EMI Options</h3>
                <p className="text-sm text-gray-500">Pay in easy installments</p>
              </div>
            </div>

            <div className="space-y-3">
              {[3, 6, 9, 12].map((months) => (
                <button
                  key={months}
                  className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-all"
                >
                  <div className="text-left">
                    <div className="font-bold text-gray-900">{months} Months EMI</div>
                    <div className="text-sm text-gray-500">₹{Math.ceil(amount / months).toLocaleString()}/month</div>
                  </div>
                  <div className="text-sm font-semibold text-primary-600">No Cost EMI</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pay Later */}
        {activeTab === PAYMENT_METHODS.PAY_LATER && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Buy Now, Pay Later</h3>
                <p className="text-sm text-gray-500">Flexible payment options</p>
              </div>
            </div>

            <div className="space-y-3">
              {['LazyPay', 'Simpl', 'ZestMoney', 'PayLater by ICICI'].map((provider) => (
                <button
                  key={provider}
                  className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-yellow-600" />
                    </div>
                    <span className="font-semibold text-gray-900">{provider}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-600" />
          <span>100% Secure</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>PCI DSS Compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-green-600" />
          <span>Instant Confirmation</span>
        </div>
      </div>
    </div>
  )
}

