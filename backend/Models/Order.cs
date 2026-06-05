using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Order
    {
        [Key]
        public int OrderID { get; set; }

        public int? UserID { get; set; }

        [ForeignKey("UserID")]
        public User? User { get; set; }

        public string ReceiverName { get; set; }

        public string ReceiverPhone { get; set; }

        public string ReceiverAddress { get; set; }

        public int OrderStatus { get; set; } = 1;

        public decimal TotalAmount { get; set; }

        public string? Note { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;

        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public ICollection<OrderDetail>? OrderDetails { get; set; }
    }
}