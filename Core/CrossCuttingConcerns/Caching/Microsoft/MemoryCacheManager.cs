using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Core.Utilities.IoC;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using ServiceStack.Text;
using static ServiceStack.Diagnostics;

namespace Core.CrossCuttingConcerns.Caching.Microsoft
{
    /// <summary>
    /// Microsoft MemoryCacheManager
    /// </summary>
    public class MemoryCacheManager : ICacheManager
    {
        private readonly IMemoryCache _cache;
        private static readonly ConcurrentDictionary<string, byte> CacheKeys = new ConcurrentDictionary<string, byte>();

        public MemoryCacheManager()
            : this(ServiceTool.ServiceProvider.GetService<IMemoryCache>())
        {
        }

        public MemoryCacheManager(IMemoryCache cache)
        {
            _cache = cache;
        }

        public void Add(string key, object data, int duration)
        {
            _cache.Set(key, data, TimeSpan.FromMinutes(duration));
            _ = CacheKeys.AddOrUpdate(key, 0, (_, __) => 0);
        }

        public void Add(string key, object data)
        {
            _cache.Set(key, data);
            _ = CacheKeys.AddOrUpdate(key, 0, (_, __) => 0);
        }

        public void Add(string key, dynamic data, int duration, Type type)
        {
            var json = JsonSerializer.SerializeToString(data.Result, type);
            Add(key, json, duration);
        }

        public void Add(string key, dynamic data, Type type)
        {
            var json = JsonSerializer.SerializeToString(data.Result, type);
            Add(key, json);
        }

        public T Get<T>(string key)
        {
            return _cache.Get<T>(key);
        }

        public object Get(string key)
        {
            return _cache.Get(key);
        }

        public object Get(string key, Type type)
        {
            var json = Get<string>(key);
            var result = JsonSerializer.DeserializeFromString(json, type);

            return typeof(Task)
                .GetMethod(nameof(Task.FromResult))
                .MakeGenericMethod(type)
                .Invoke(this, new object[] { result });
        }

        public bool IsAdd(string key)
        {
            return _cache.TryGetValue(key, out _);
        }

        public void Remove(string key)
        {
            _cache.Remove(key);
            _ = CacheKeys.TryRemove(key, out _);
        }

        public void RemoveByPattern(string pattern)
        {
            var regex = new Regex(pattern, RegexOptions.Singleline | RegexOptions.Compiled | RegexOptions.IgnoreCase);
            var snapshotKeys = CacheKeys.Keys.ToList();
            foreach (var key in snapshotKeys)
            {
                if (regex.IsMatch(key))
                {
                    _cache.Remove(key);
                    _ = CacheKeys.TryRemove(key, out _);
                }
            }
        }
    }
}