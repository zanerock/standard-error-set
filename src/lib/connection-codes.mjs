const connectionCodes = {
  ECONNRESET : 'has been reset',
  ENOTFOUND : 'host not found; check for typos',
  ETIMEDOUT : 'request timed out',
  ECONNREFUSED : 'refused; check port and ensure target service is running',
  ERRADDRINUSE : 'port already bound; verify port and check for duplicate or conflicting service',
  EADDRNOTAVAIL : 'address not available; verify binding IP address correct and exists or try binding to 0.0.0.0',
  ECONNABORTED : "connection prematurely aborted; this is possibly due to 'result.end()' being called before 'result.sendFile()' could complete",
  EHOSTUNREACH : 'host unreachable; check local routing configuration and target and intermediate firewalls',
  EAI_AGAIN : 'host name cannot be resolved due to temporary DNS resolution issue; verify internet connection is stable and check DNS resolution settings (/etc/resolv.conf and /etc/hosts)'
}

export { connectionCodes }