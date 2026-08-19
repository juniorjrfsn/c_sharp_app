using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.Business.Exceptions
{
    public class BusinessValidationException : Exception
    {
        public BusinessValidationException() { }

        public BusinessValidationException(string message)
            : base(message) { }

        public BusinessValidationException(string message, Exception innerException)
            : base(message, innerException) { }
    }
}
