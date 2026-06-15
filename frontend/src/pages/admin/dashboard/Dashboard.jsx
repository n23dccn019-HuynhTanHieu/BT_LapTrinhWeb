import React, { useEffect, useState } from "react";
import dashboardService from "../../../services/dashboardService";
import {
  ShoppingBag,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

  useEffect(() => {
    loadOverview();
  }, []);
  useEffect(() => {
    loadRevenue();
  }, [timeFrame]);

  const loadOverview = async () => {
    try {
      const res = await dashboardService.getOverview();
      setOverview(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRevenue = async () => {
    try {
      let res;
      if (timeFrame === "day") {
        res = await dashboardService.getRevenueByDay();
      } else if (timeFrame === "week") {
        res = await dashboardService.getRevenueByWeek();
      } else {
        res = await dashboardService.getRevenueByMonth();
      }

      const formattedData = res.data.map((item) => {
        let displayTime = "";
        if (timeFrame === "day") {
          displayTime = new Date(item.date).toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "short",
          });
        } else if (timeFrame === "week") {
          if (item.week) {
            displayTime = `Tuần ${item.week}/${item.year || 2026}`;
          } else if (item.date || item.startDate) {
            displayTime =
              "T. " +
              new Date(item.date || item.startDate).toLocaleDateString(
                "vi-VN",
                { day: "numeric", month: "short" },
              );
          } else {
            displayTime = item.label || "Không rõ";
          }
        } else {
          displayTime = `${item.month}/${item.year}`;
        }

        return {
          ...item,
          displayTime,
          revenue: item.revenue || 0,
        };
      });

      setRevenueData(formattedData);
    } catch (err) {
      console.error(err);
      setRevenueData([]);
    }
  };

  const systemFont =
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        width: "100%",
        fontFamily: systemFont,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      {/* Header Panel */}
      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "16px",
          border: "2px solid #cbd5e1",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "22px",
              fontWeight: "700",
              margin: 0,
              color: "#0f172a",
            }}
          >
            <TrendingUp
              style={{ color: "#2563eb" }}
              size={24}
              strokeWidth={2.5}
            />
            Tổng Quan Hệ Thống
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#64748b",
              fontWeight: "500",
              marginTop: "6px",
              margin: 0,
            }}
          >
            Theo dõi hiệu suất kinh doanh thực tế toàn sàn.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            background: "#e2e8f0",
            padding: "4px",
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
          }}
        >
          <button
            onClick={() => setTimeFrame("day")}
            style={{
              padding: "8px 18px",
              fontSize: "13px",
              borderRadius: "8px",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
              background: timeFrame === "day" ? "#ffffff" : "transparent",
              color: timeFrame === "day" ? "#2563eb" : "#334155",
              boxShadow:
                timeFrame === "day" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
          >
            Theo ngày
          </button>
          <button
            onClick={() => setTimeFrame("week")}
            style={{
              padding: "8px 18px",
              fontSize: "13px",
              borderRadius: "8px",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
              background: timeFrame === "week" ? "#ffffff" : "transparent",
              color: timeFrame === "week" ? "#2563eb" : "#334155",
              boxShadow:
                timeFrame === "week" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
          >
            Theo tuần
          </button>
          <button
            onClick={() => setTimeFrame("month")}
            style={{
              padding: "8px 18px",
              fontSize: "13px",
              borderRadius: "8px",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
              background: timeFrame === "month" ? "#ffffff" : "transparent",
              color: timeFrame === "month" ? "#2563eb" : "#334155",
              boxShadow:
                timeFrame === "month" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
          >
            Theo tháng
          </button>
        </div>
      </div>

      {/* Grid Khối số liệu Thống kê - ĐÃ NỚI RỘNG minmax LÊN 280px VÀ TĂNG PADDING */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          width: "100%",
        }}
      >
        {/* Card 1 */}
        <div
          style={{
            background: "#ffffff",
            padding: "24px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: "16px",
            border: "2px solid #cbd5e1",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "13px",
                fontWeight: "700",
                textTransform: "uppercase",
                color: "#64748b",
                letterSpacing: "0.5px",
                margin: 0,
              }}
            >
              Tổng sản phẩm
            </p>
            <h3
              style={{
                fontSize: "30px",
                fontWeight: "700",
                margin: "6px 0 0 0",
                color: "#0f172a",
              }}
            >
              {overview.totalProducts}
            </h3>
          </div>
          <div
            style={{
              background: "rgba(37, 99, 235, 0.15)",
              color: "#2563eb",
              padding: "14px",
              borderRadius: "12px",
              display: "flex",
            }}
          >
            <ShoppingBag size={22} strokeWidth={2.5} />
          </div>
        </div>

        {/* Card 2 */}
        <div
          style={{
            background: "#ffffff",
            padding: "24px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: "16px",
            border: "2px solid #cbd5e1",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "13px",
                fontWeight: "700",
                textTransform: "uppercase",
                color: "#64748b",
                letterSpacing: "0.5px",
                margin: 0,
              }}
            >
              Khách hàng
            </p>
            <h3
              style={{
                fontSize: "30px",
                fontWeight: "700",
                margin: "6px 0 0 0",
                color: "#0f172a",
              }}
            >
              {overview.totalUsers}
            </h3>
          </div>
          <div
            style={{
              background: "rgba(170, 59, 255, 0.15)",
              color: "#aa3bff",
              padding: "14px",
              borderRadius: "12px",
              display: "flex",
            }}
          >
            <Users size={22} strokeWidth={2.5} />
          </div>
        </div>

        {/* Card 3 */}
        <div
          style={{
            background: "#ffffff",
            padding: "24px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: "16px",
            border: "2px solid #cbd5e1",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "13px",
                fontWeight: "700",
                textTransform: "uppercase",
                color: "#64748b",
                letterSpacing: "0.5px",
                margin: 0,
              }}
            >
              Đơn hàng
            </p>
            <h3
              style={{
                fontSize: "30px",
                fontWeight: "700",
                margin: "6px 0 0 0",
                color: "#0f172a",
              }}
            >
              {overview.totalOrders}
            </h3>
          </div>
          <div
            style={{
              background: "rgba(245, 158, 11, 0.15)",
              color: "#d97706",
              padding: "14px",
              borderRadius: "12px",
              display: "flex",
            }}
          >
            <ShoppingCart size={22} strokeWidth={2.5} />
          </div>
        </div>

        {/* Card 4 */}
        <div
          style={{
            background: "#ffffff",
            padding: "24px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: "16px",
            border: "2px solid #cbd5e1",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "13px",
                fontWeight: "700",
                textTransform: "uppercase",
                color: "#64748b",
                letterSpacing: "0.5px",
                margin: 0,
              }}
            >
              Doanh thu tổng
            </p>
            <h3
              style={{
                fontSize: "26px",
                fontWeight: "700",
                margin: "6px 0 0 0",
                color: "#10b981",
              }}
            >
              {overview.revenue.toLocaleString("vi-VN")}{" "}
              <span style={{ fontSize: "18px", fontWeight: "500" }}>đ</span>
            </h3>
          </div>
          <div
            style={{
              background: "rgba(16, 185, 129, 0.15)",
              color: "#059669",
              padding: "14px",
              borderRadius: "12px",
              display: "flex",
            }}
          >
            <DollarSign size={22} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Biểu đồ và bảng phụ chi tiết bên dưới */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            border: "2px solid #cbd5e1",
            padding: "24px",
            minWidth: 0,
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                margin: 0,
                fontWeight: "700",
                fontSize: "16px",
                color: "#0f172a",
              }}
            >
              Biểu đồ xu hướng dòng tiền (
              {timeFrame === "day"
                ? "Theo ngày"
                : timeFrame === "week"
                  ? "Theo tuần"
                  : "Theo tháng"}
              )
            </h3>
          </div>
          <div style={{ width: "100%", height: "300px", position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#cbd5e1"
                />
                <XAxis
                  dataKey="displayTime"
                  stroke="#64748b"
                  fontSize={12}
                  fontWeight="600"
                  tickLine={false}
                  fontFamily={systemFont}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  fontWeight="600"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                  fontFamily={systemFont}
                />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    borderRadius: "12px",
                    border: "2px solid #cbd5e1",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    fontFamily: systemFont,
                  }}
                  labelStyle={{ fontWeight: "700", color: "#0f172a" }}
                  formatter={(v) => [
                    `${v.toLocaleString("vi-VN")} đ`,
                    "Doanh thu",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            border: "2px solid #cbd5e1",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            maxHeight: "368px",
          }}
        >
          <h3
            style={{
              margin: "0 0 16px 0",
              fontWeight: "700",
              fontSize: "16px",
              color: "#0f172a",
            }}
          >
            Chi tiết doanh số
          </h3>
          <div style={{ overflowY: "auto", flex: 1, paddingRight: "4px" }}>
            <table
              style={{
                width: "100%",
                fontSize: "14px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    color: "#0f172a",
                    borderBottom: "3px solid #cbd5e1",
                    textAlign: "left",
                  }}
                >
                  <th
                    style={{
                      paddingBottom: "10px",
                      fontSize: "12px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                    }}
                  >
                    Thời gian
                  </th>
                  <th
                    style={{
                      paddingBottom: "10px",
                      fontSize: "12px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      textAlign: "right",
                    }}
                  >
                    Doanh thu
                  </th>
                </tr>
              </thead>
              <tbody>
                {revenueData &&
                  revenueData.map((item, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #cbd5e1" }}>
                      <td
                        style={{
                          padding: "12px 0",
                          color: "#64748b",
                          fontWeight: "600",
                        }}
                      >
                        {item.displayTime}
                      </td>
                      <td
                        style={{
                          padding: "12px 0",
                          textAlign: "right",
                          fontWeight: "700",
                          color: "#10b981",
                        }}
                      >
                        {item.revenue
                          ? `${item.revenue.toLocaleString("vi-VN")} đ`
                          : "0 đ"}
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
