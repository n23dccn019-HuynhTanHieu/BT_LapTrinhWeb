namespace backend.DTOs
{
    public class CreateOrderDTO
    {
        public int? UserID { get; set; }

        public string ReceiverName { get; set; }

        public string ReceiverPhone { get; set; }

        public string ReceiverAddress { get; set; }

        public string? Note { get; set; }

        public List<OrderItemDTO> Items { get; set; }
    }

    public class OrderItemDTO
    {
        public int ProductID { get; set; }

        public int Quantity { get; set; }
    }
}