
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNMyLocationDirectionSpec.h"

@interface MyLocationDirection : NSObject <NativeMyLocationDirectionSpec>
#else
#import <React/RCTBridgeModule.h>

@interface MyLocationDirection : NSObject <RCTBridgeModule>
#endif

@end
