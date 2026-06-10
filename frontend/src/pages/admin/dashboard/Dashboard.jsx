import React, { useEffect, useState } from "react";
import dashboardService from "../../../services/dashboardService";
import { 
  ShoppingBag, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Calendar, 
  TrendingUp 
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";

const Dashboard = () => {
  const [overview, setOverview] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [timeFrame, setTimeFrame] = useState("month");

  useEffect(() => { loadOverview(); }, []);
  useEffect(() => { loadRevenue(); }, [timeFrame]);

  const loadOverview = async () => {
    try {
      const res = await dashboardService.getOverview();
      setOverview(res.data);
    } catch (err) { console.error(err); }
  };

  const loadRevenue = async () => {
    try {
      const res = timeFrame === "day"
          ? await dashboardService.getRevenueByDay()
          : await dashboardService.getRevenueByMonth();

      const formattedData = res.data.map(item => ({
        ...item,
        displayTime: timeFrame === "day"
          ? new Date(item.date).toLocaleDateString("vi-VN", { day: 'numeric', month: 'short' })
          : `${item.month}/${item.year}`
      }));
      setRevenueData(formattedData);
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', WebkitFontSmoothing: 'subpixel-antialiased', MozOsxFontSmoothing: 'auto' }}>
      
      {/* Header Panel */}
      <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '2px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', fontWeight: '900', margin: 0, color: '#000000' }}>
            <TrendingUp style={{ color: '#2563eb' }} size={24} strokeWidth={3} />
            Tổng quan Hệ thống
          </h2>
          <p style={{ fontSize: '14px', color: '#0f172a', fontWeight: '700', marginTop: '6px' }}>Theo dõi hiệu suất kinh doanh thực tế toàn sàn.</p>
        </div>

        {/* Tab chuyển đổi thời gian */}
        <div style={{ display: 'flex', background: '#e2e8f0', padding: '4px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
          <button
            onClick={() => setTimeFrame("day")}
            className={`category-tab ${timeFrame === 'day' ? 'active' : ''}`}
            style={{ padding: '8px 18px', fontSize: '13px', borderRadius: '8px', fontWeight: '800', color: timeFrame === 'day' ? '#2563eb' : '#334155' }}
          >
            Theo ngày
          </button>
          <button
            onClick={() => setTimeFrame("month")}
            className={`category-tab ${timeFrame === 'month' ? 'active' : ''}`}
            style={{ padding: '8px 18px', fontSize: '13px', borderRadius: '8px', fontWeight: '800', color: timeFrame === 'month' ? '#2563eb' : '#334155' }}
          >
            Theo tháng
          </button>
        </div>
      </div>

      {/* Grid Khối số liệu Thống kê */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', width: '100%' }}>
        
        {/* Card 1 */}
        <div className="product-card" style={{ padding: '24px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', margin: 0, border: '2px solid #cbd5e1' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', color: '#1e293b', letterSpacing: '0.5px', margin: 0 }}>Tổng sản phẩm</p>
            <h3 style={{ fontSize: '30px', fontWeight: '900', margin: '4px 0 0 0', color: '#000000' }}>{overview.totalProducts}</h3>
          </div>
          <div style={{ background: 'rgba(37, 99, 235, 0.15)', color: '#2563eb', padding: '14px', borderRadius: '12px', display: 'flex' }}><ShoppingBag size={22} strokeWidth={2.5} /></div>
        </div>

        {/* Card 2 */}
        <div className="product-card" style={{ padding: '24px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', margin: 0, border: '2px solid #cbd5e1' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', color: '#1e293b', letterSpacing: '0.5px', margin: 0 }}>Khách hàng</p>
            <h3 style={{ fontSize: '30px', fontWeight: '900', margin: '4px 0 0 0', color: '#000000' }}>{overview.totalUsers}</h3>
          </div>
          <div style={{ background: 'rgba(170, 59, 255, 0.15)', color: '#aa3bff', padding: '14px', borderRadius: '12px', display: 'flex' }}><Users size={22} strokeWidth={2.5} /></div>
        </div>

        {/* Card 3 */}
        <div className="product-card" style={{ padding: '24px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', margin: 0, border: '2px solid #cbd5e1' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', color: '#1e293b', letterSpacing: '0.5px', margin: 0 }}>Đơn hàng</p>
            <h3 style={{ fontSize: '30px', fontWeight: '900', margin: '4px 0 0 0', color: '#000000' }}>{overview.totalOrders}</h3>
          </div>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#d97706', padding: '14px', borderRadius: '12px', display: 'flex' }}><ShoppingCart size={22} strokeWidth={2.5} /></div>
        </div>

        {/* Card 4 */}
        <div className="product-card" style={{ padding: '24px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', margin: 0, border: '2px solid #cbd5e1' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', color: '#1e293b', letterSpacing: '0.5px', margin: 0 }}>Doanh thu</p>
            <h3 style={{ fontSize: '26px', fontWeight: '900', margin: '4px 0 0 0', color: '#dc2626' }}>{overview.revenue.toLocaleString("vi-VN")} đ</h3>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#059669', padding: '14px', borderRadius: '12px', display: 'flex' }}><DollarSign size={22} strokeWidth={2.5} /></div>
        </div>

      </div>

      {/* Biểu đồ xu hướng và bảng dữ liệu chi tiết */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', width: '100%' }}>
        
        {/* Khung chứa đồ thị */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '2px solid #cbd5e1', padding: '24px', minWidth: 0 }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontWeight: '900', fontSize: '16px', color: '#000000' }}>Biểu đồ xu hướng dòng tiền</h3>
          </div>
          <div style={{ width: '100%', height: '300px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                <XAxis dataKey="displayTime" stroke="#000000" fontSize={12} fontWeight="700" tickLine={false} />
                <YAxis stroke="#000000" fontSize={12} fontWeight="700" tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
                <Tooltip formatter={(v) => [`${v.toLocaleString("vi-VN")} đ`, "Doanh thu"]} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Khung bảng phụ chi tiết */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '2px solid #cbd5e1', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 16px 0', fontWeight: '900', fontSize: '16px', color: '#000000' }}>Chi tiết doanh số</h3>
          <div style={{ overflowY: 'auto', flex: 1, maxHeight: '280px' }}>
            <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: '#000000', borderBottom: '3px solid #cbd5e1', textAlign: 'left' }}>
                  <th style={{ paddingBottom: '10px', fontWeight: '900' }}>Thời gian</th>
                  <th style={{ paddingBottom: '10px', fontWeight: '900', textAlign: 'right' }}>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {revenueData && revenueData.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #cbd5e1' }}>
                    <td style={{ padding: '12px 0', color: '#0f172a', fontWeight: '700' }}>{item.displayTime}</td>
                    <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: '900', color: '#047857' }}>
                      {item.revenue ? `${item.revenue.toLocaleString("vi-VN")} đ` : '0 đ'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;