using System;

namespace Core.Entities
{
    public class BaseEntity : BaseEntity<int> { }
    public class BaseEntity<T> : IEntity
    {
        public virtual T Id { get; set; }
        public virtual int CreatedUserId { get; set; }
        public virtual DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public virtual int LastUpdatedUserId { get; set; }
        public virtual DateTime? LastUpdatedDate { get; set; }
        public virtual bool Status { get; set; } = true;
        public virtual bool IsDeleted { get; set; } = false;
    }
}
