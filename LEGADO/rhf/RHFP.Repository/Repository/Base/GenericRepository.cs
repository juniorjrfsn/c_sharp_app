using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.Repository.Base
{
    public class GenericRepository<T> : IRepository<T> where T : class
    {
        protected readonly RHFPContext _context;
        protected readonly DbSet<T> _dbSet;

        public GenericRepository(RHFPContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public IEnumerable<T> GetAll()
        {
            try
            {
                return _dbSet.ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao obter todos os registros: {ex.Message}", ex);
            }
        }

        public T GetById(int id)
        {
            try
            {
                return _dbSet.Find(id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao obter registro com ID {id}: {ex.Message}", ex);
            }
        }

        public void Add(T entity)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _dbSet.Add(entity);
                    _context.SaveChanges();
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new Exception($"Erro ao adicionar registro: {ex.Message}", ex);
                }
            }
        }

        public void Update(T entity)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _dbSet.Attach(entity);
                    _context.Entry(entity).State = EntityState.Modified;
                    _context.SaveChanges();
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new Exception($"Erro ao atualizar registro: {ex.Message}", ex);
                }
            }
        }

        public void Delete(int id)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var entity = GetById(id);
                    if (entity != null)
                    {
                        _dbSet.Remove(entity);
                        _context.SaveChanges();
                        transaction.Commit();
                    }
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new Exception($"Erro ao excluir registro com ID {id}: {ex.Message}", ex);
                }
            }
        }
    }
}
