import CustomTable, { type Column } from "@/components/shared/CustomTable";
import PageHeading from "@/components/shared/PageHeading";
import type { Transaction } from "@/types/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

export default function TransactionsPage() {
  const { t } = useTranslation();
  const { currentLanguage } = useI18n();
  const isRTL = currentLanguage === 'ar';
  const [data] = useState([
    {
      id: "1",
      clientName: "Theresa Webb",
      lawyerName: "Theresa Webb",
      answerPrice: "$475.22",
      platformFees: "2",
      lawyerShare: "2",
      transactionDate: "October 24, 2018",
    },
    {
      id: "2",
      clientName: "Theresa Webb",
      lawyerName: "Theresa Webb",

      answerPrice: "$475.22",
      platformFees: "2",
      lawyerShare: "12",
      transactionDate: "October 24, 2018",
    },
    {
      id: "3",
      clientName: "Theresa Webb",
      lawyerName: "Theresa Webb",

      answerPrice: "$475.22",
      platformFees: "2",
      lawyerShare: "22",
      transactionDate: "October 24, 2018",
    },
    {
      id: "4",
      clientName: "Theresa Webb",
      lawyerName: "Theresa Webb",

      answerPrice: "$475.22",
      platformFees: "2",
      lawyerShare: "44",
      transactionDate: "October 24, 2018",
    },
    {
      id: "5",
      clientName: "Theresa Webb",
      lawyerName: "Theresa Webb",

      answerPrice: "$475.22",
      platformFees: "2",
      lawyerShare: "23",
      transactionDate: "October 24, 2018",
    },
    {
      id: "6",
      clientName: "Theresa Webb",
      lawyerName: "Theresa Webb",

      answerPrice: "$475.22",
      platformFees: "1",
      lawyerShare: "5",
      transactionDate: "October 24, 2018",
    },
  ]);

  const columns: Column<Transaction>[] = [
    {
      key: "clientName",
      header: t('pages.transactions.columns.clientName'),
      width: "20%",
    },
    {
      key: "lawyerName",
      header: t('pages.transactions.columns.lawyerName'),
      width: "20%",
    },
    {
      key: "answerPrice",
      header: t('pages.transactions.columns.answerPrice'),
      width: "15%",
    },
    {
      key: "platformFees",
      header: t('pages.transactions.columns.platformFees'),
      width: "15%",
    },
    {
      key: "lawyerShare",
      header: t('pages.transactions.columns.lawyerShare'),
      width: "15%",
    },
    {
      key: "transactionDate",
      header: t('pages.transactions.columns.transactionDate'),
      cellClass: "py-6",
      width: "15%",
    },
  ];

    const [selectedDate, setSelectedDate] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleDateFilterClick = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date.toISOString().split('T')[0]);
    setIsDatePickerOpen(false);
    console.log('Selected date:', date.toISOString().split('T')[0]);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getMonthName = (date: Date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[date.getMonth()];
  };

  const dateFilterButton = (
    <div className="relative">
      <Button 
        variant="default" 
        className="flex p-3 items-center gap-2 hover:bg-slate-800 border-gray-300 p-6"
        onClick={handleDateFilterClick}
      >
        <Calendar className="h-4 w-4" />
        {t('pages.transactions.dateFilter')}
      </Button>
      
       {isDatePickerOpen && (
         <div className={`absolute top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 min-w-[280px] ${
           isRTL ? 'right-0 -translate-x-4' : 'left-0'
         }`}>
                     {/* Header */}
           <div className="flex items-center justify-between mb-4">
             <Button
               variant="ghost"
               size="sm"
               onClick={isRTL ? goToNextMonth : goToPreviousMonth}
               className="h-8 w-8 p-0"
             >
               {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
             </Button>
             <h3 className="text-lg font-semibold">
               {getMonthName(currentMonth)} {currentMonth.getFullYear()}
             </h3>
             <Button
               variant="ghost"
               size="sm"
               onClick={isRTL ? goToPreviousMonth : goToNextMonth}
               className="h-8 w-8 p-0"
             >
               {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
             </Button>
           </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((date, index) => (
              <div key={index} className="text-center">
                {date ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDateSelect(date)}
                    className={`h-8 w-8 p-0 text-sm ${
                      selectedDate === date.toISOString().split('T')[0]
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {date.getDate()}
                  </Button>
                ) : (
                  <div className="h-8 w-8" />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedDate("");
                setIsDatePickerOpen(false);
              }}
            >
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                handleDateSelect(today);
              }}
            >
              Today
            </Button>
          </div>
        </div>
      )}

      {selectedDate && (
        <div className="mt-2">
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md">
            {new Date(selectedDate).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <>
      <PageHeading 
        heading={t('pages.transactions.title')} 
        path={t('pages.transactions.path')} 
      />
      <CustomTable<Transaction> 
        data={data} 
        columns={columns} 
        headerActions={dateFilterButton}
      />
    </>
  );
}
