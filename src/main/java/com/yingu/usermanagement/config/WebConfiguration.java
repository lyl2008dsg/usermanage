package com.yingu.usermanagement.config;

import org.apache.catalina.Context;
import org.apache.catalina.connector.Connector;
import org.apache.tomcat.util.descriptor.web.SecurityCollection;
import org.apache.tomcat.util.descriptor.web.SecurityConstraint;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.embedded.EmbeddedServletContainerFactory;
import org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedServletContainerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.annotation.Order;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.io.File;

/**
 * Created by liuxiaohua on 2016/10/18.
 */
@Configuration
@PropertySource("classpath:/tomcat-https.properties")
@EnableConfigurationProperties(WebConfiguration.TomcatSslConnectorProperties.class)
@Order(4)
public class WebConfiguration extends WebMvcConfigurerAdapter {

    @Bean
    public EmbeddedServletContainerFactory servletContainer(TomcatSslConnectorProperties properties) {
        TomcatEmbeddedServletContainerFactory tomcat = new TomcatEmbeddedServletContainerFactory() {
            @Override
            protected void postProcessContext(Context context) {
                // SecurityConstraint必须存在，可以通过其为不同的URL设置不同的重定向策略。
                SecurityConstraint securityConstraint = new SecurityConstraint();
                securityConstraint.setUserConstraint("CONFIDENTIAL");
                SecurityCollection collection = new SecurityCollection();
                collection.addPattern("/*");
                securityConstraint.addCollection(collection);
                context.addConstraint(securityConstraint);
            }
        };
        tomcat.addAdditionalTomcatConnectors(createSslConnector(properties));
        return tomcat;
    }

    private Connector createSslConnector(TomcatSslConnectorProperties properties) {
        Connector connector = new Connector();
        properties.configureConnector(connector);
        return connector;
    }

    @ConfigurationProperties(prefix = "custom.tomcat.https")
    public static class TomcatSslConnectorProperties {
        @Value("${custom.tomcat.https.port}")
        private Integer port ;
        private Boolean ssl = true;
        private Boolean secure = true;
        private String scheme = "https";
        @Value("${custom.tomcat.https.keystore}")
        private File keystore ;
        @Value("${custom.tomcat.https.keystorePassword}")
        private String keystorePassword ;

        // 省略 get set

        public void configureConnector(Connector connector) {
            if (port != null) {
                connector.setPort(port);
            }
            if (secure != null) {
                connector.setSecure(secure);
            }
            if (scheme != null) {
                connector.setScheme(scheme);
            }
            if (ssl != null) {
                connector.setProperty("SSLEnabled", ssl.toString());
            }
            if (keystore != null && keystore.exists()) {
                connector.setProperty("keystoreFile", keystore.getAbsolutePath());
                connector.setProperty("keystorePass", keystorePassword);
            }
        }

    }

}
