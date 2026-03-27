package com.example.api_gateway.filters;


import com.example.api_gateway.Service.JwtService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.web.server.ServerWebExchange;

@Slf4j
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config>
{
    private final JwtService jwtService;

    public AuthenticationFilter(JwtService jwtService){
        super(Config.class);
        this.jwtService = jwtService;
    }
    @Override
    public GatewayFilter apply(Config config) {
        return (exchange , chain)->{
            log.info("login request {}", exchange.getRequest().getURI());
            final String tokenHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
            if(tokenHeader==null || !tokenHeader.startsWith("Bearer ")){
                exchange.getResponse().getStatusCode();
                log.error("the Authorization Token Header is no found ");
                return exchange.getResponse().setComplete();
            }
            final String token = tokenHeader.split("Bearer ")[1];

            // now if the token is found then get the userID form the token using jwt Service .
            String userId = jwtService.getUserIdFromToken(token);
            ServerWebExchange modifyChanges = exchange.mutate().request(r->r.header("X-User-Id", userId)).build();


            return chain.filter(modifyChanges);

        };
    }

    public static class Config{

    }

}
