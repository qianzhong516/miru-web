import React, { useEffect, useState } from "react";

import { ArrowLeftIcon } from "miruIcons";
import { useParams } from "react-router-dom";
import { Button, Toastr } from "StyledComponents";

import invoicesApi from "apis/invoices";
import PaymentsProviders from "apis/payments/providers";
import { ApiStatus as InvoiceStatus } from "constants/index";
import { useUserContext } from "context/UserContext";
import { sendGAPageView } from "utils/googleAnalytics";

import Header from "./Header";
import InvoiceDetails from "./InvoiceDetails";
import MobileView from "./MobileView";
import ViewHistory from "./ViewHistory";

import SendInvoiceContainer from "../Generate/MobileView/Container/SendInvoiceContainer";
import ConnectPaymentGateway from "../popups/ConnectPaymentGateway";
import DeleteInvoice from "../popups/DeleteInvoice";
import SendInvoice from "../popups/SendInvoice";
import WavieOffInvoice from "../popups/WavieOffInvoice";

const Invoice = () => {
  const params = useParams();

  const [status, setStatus] = useState<InvoiceStatus>(InvoiceStatus.IDLE);
  const [invoice, setInvoice] = useState<any>(null);
  const [showSendInvoiceModal, setShowSendInvoiceModal] =
    useState<boolean>(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [invoiceToWaive, setInvoiceToWaive] = useState(null);
  const [showWavieDialog, setShowWavieDialog] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [isSendReminder, setIsSendReminder] = useState<boolean>(false);
  const [showConnectPaymentDialog, setShowConnectPaymentDialog] =
    useState<boolean>(false);
  const [isStripeEnabled, setIsStripeEnabled] = useState<boolean>(null);
  const { isDesktop } = useUserContext();
  const fetchInvoice = async () => {
    try {
      setStatus(InvoiceStatus.LOADING);
      const res = await invoicesApi.getInvoice(params.id);
      setInvoice(res.data);
      setStatus(InvoiceStatus.SUCCESS);
    } catch {
      setStatus(InvoiceStatus.ERROR);
    }
  };

  useEffect(() => {
    sendGAPageView();
    fetchInvoice();
    fetchPaymentsProvidersSettings();
  }, []);

  const handleSendInvoice = () => {
    setShowSendInvoiceModal(true);
  };

  const fetchPaymentsProvidersSettings = async () => {
    try {
      const res = await PaymentsProviders.get();
      const paymentsProviders = res.data.paymentsProviders;
      const stripe = paymentsProviders.find(p => p.name === "stripe");
      setIsStripeEnabled(!!stripe && stripe.enabled);
    } catch {
      Toastr.error("ERROR! CONNECTING TO PAYMENTS");
    }
  };

  return (
    status === InvoiceStatus.SUCCESS &&
    (isDesktop ? (
      <>
        <Header
          handleSendInvoice={handleSendInvoice}
          invoice={invoice}
          isStripeEnabled={isStripeEnabled}
          setInvoiceToDelete={setInvoiceToDelete}
          setInvoiceToWaive={setInvoiceToWaive}
          setIsSendReminder={setIsSendReminder}
          setShowConnectPaymentDialog={setShowConnectPaymentDialog}
          setShowDeleteDialog={setShowDeleteDialog}
          setShowHistory={setShowHistory}
          setShowWavieDialog={setShowWavieDialog}
        />
        <div className="m-0 mt-5 mb-10 w-full bg-miru-gray-100 p-0">
          <InvoiceDetails invoice={invoice} />
        </div>
        {!showConnectPaymentDialog &&
          (showSendInvoiceModal || isSendReminder) && (
            <SendInvoice
              invoice={invoice}
              isSendReminder={isSendReminder}
              isSending={showSendInvoiceModal}
              setIsSendReminder={setIsSendReminder}
              setIsSending={setShowSendInvoiceModal}
            />
          )}
        {!isStripeEnabled && showConnectPaymentDialog && (
          <ConnectPaymentGateway
            invoice={invoice}
            setIsSending={setShowSendInvoiceModal}
            setShowConnectPaymentDialog={setShowConnectPaymentDialog}
            showConnectPaymentDialog={showConnectPaymentDialog}
          />
        )}
        {showWavieDialog && (
          <WavieOffInvoice
            invoice={invoiceToWaive}
            invoiceNumber={invoice.invoiceNumber}
            setShowWavieDialog={setShowWavieDialog}
            showWavieDialog={showWavieDialog}
          />
        )}
        {showHistory && (
          <ViewHistory invoice={invoice} setShowHistory={setShowHistory} />
        )}
        {showDeleteDialog && (
          <DeleteInvoice
            invoice={invoiceToDelete}
            setShowDeleteDialog={setShowDeleteDialog}
            showDeleteDialog={showDeleteDialog}
          />
        )}
      </>
    ) : showSendInvoiceModal ? (
      <div className="flex h-full flex-col">
        <div className="flex w-full bg-miru-han-purple-1000 pl-4">
          <Button
            style="ternary"
            onClick={() => {
              if (isSendReminder) {
                setShowSendInvoiceModal(false);
                setIsSendReminder(false);
              } else {
                setShowSendInvoiceModal(false);
              }
            }}
          >
            <ArrowLeftIcon className="text-white" size={16} weight="bold" />
          </Button>
          <div className="flex h-12 w-full items-center justify-center bg-miru-han-purple-1000 px-3 text-white">
            {isSendReminder ? "Send Invoice Reminder" : "Send Invoice"}
          </div>
        </div>
        <div className="flex flex-1">
          <SendInvoiceContainer
            handleSaveSendInvoice={null}
            invoice={invoice}
            isSendReminder={isSendReminder}
            setIsSendReminder={setIsSendReminder}
            setIsSending={setShowSendInvoiceModal}
          />
        </div>
      </div>
    ) : (
      <MobileView
        handleSendInvoice={handleSendInvoice}
        invoice={invoice}
        isStripeEnabled={isStripeEnabled}
        setIsSendReminder={setIsSendReminder}
        setShowConnectPaymentDialog={setShowConnectPaymentDialog}
        setShowSendInvoiceModal={setShowSendInvoiceModal}
        showConnectPaymentDialog={showConnectPaymentDialog}
      />
    ))
  );
};

export default Invoice;
