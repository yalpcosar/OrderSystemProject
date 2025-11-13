using Core.Entities;

namespace Entities.Concrete
{
    public class EntityExample : BaseEntity, IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}